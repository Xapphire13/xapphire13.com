import './styles/home-page.less';
import React from 'react';
import { PlusCircle } from 'react-feather';
import { RouteComponentProps } from 'react-router';
import { ScaleLoader } from 'halogenium';
import * as ClientApi from './api/client-api';
import * as Utils from './utils';
import { Disposable } from './disposable';
import PostPreview from './post-preview';
import UserContext from './user-context';
import Post from ':entities/post';

import throttle = require('throttleit');

const MAX_PREVIEW_LENGTH = 4000;

type Props = RouteComponentProps<any>;

type State = {
  loading: boolean;
  loadedPosts: Post[];
  allPostsLoaded: boolean;
};

export default class HomePage extends React.Component<Props, State> {
  private scrollSubscription: Disposable = { dispose: () => {} };

  private ref: HTMLDivElement | null;

  private loadPosts = (() => {
    let contToken: string | null;
    let currentlyLoading = false;

    return async (): Promise<boolean> => {
      if (currentlyLoading) {
        return !!contToken;
      }

      currentlyLoading = true;

      try {
        if (contToken === null) {
          return false;
        }

        const { loadedPosts } = this.state;
        this.setState({
          loading: true
        });

        const { continuationToken, values } = await ClientApi.getPosts(
          contToken
        );

        loadedPosts.push(...values);

        this.setState({
          loadedPosts,
          loading: false,
          allPostsLoaded: !continuationToken
        });

        // eslint-disable-next-line no-return-assign
        return !!(contToken = continuationToken || null);
      } finally {
        currentlyLoading = false;
      }
    };
  })();

  constructor(props: Props) {
    super(props);
    this.state = {
      loading: true,
      loadedPosts: [],
      allPostsLoaded: false
    };
  }

  public async componentDidMount(): Promise<void> {
    const isMore = await this.loadPosts();

    if (isMore) {
      this.scrollSubscription = Utils.subscribeToEvent(
        window,
        'scroll',
        this.onScroll
      );
    }
  }

  public componentDidUpdate(_prevProps: Props, prevState: State): void {
    const { loading, allPostsLoaded } = this.state;

    if (prevState.loading && !loading && !allPostsLoaded) {
      window.requestAnimationFrame(() => {
        if (this.ref && this.ref.clientHeight <= window.innerHeight) {
          this.loadPosts();
        }
      });
    }
  }

  public componentWillUnmount(): void {
    this.scrollSubscription.dispose();
  }

  private onScroll = throttle(async () => {
    const app = document.getElementById('app');
    if (app && window.innerHeight + window.scrollY + 200 >= app.offsetHeight) {
      if (!(await this.loadPosts())) {
        this.scrollSubscription.dispose();
      }
    }
  }, 500);

  private loadingMessage = (): JSX.Element | null => {
    const { allPostsLoaded, loadedPosts, loading } = this.state;

    if (allPostsLoaded) {
      if (loadedPosts.length === 0) {
        return <p className="post-loading-status">No posts to load...</p>;
      }

      return (
        <p className="post-loading-status">
          Looks like you&apos;ve reached the end...
        </p>
      );
    }

    if (loading) {
      return (
        <div className="post-loading-status">
          <ScaleLoader />
        </div>
      );
    }

    return null;
  };

  private newPost = (): JSX.Element => {
    const { history } = this.props;
    return (
      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
      <div
        className="new-post"
        title="New post"
        onClick={() => history.push('/posts/new')}
      >
        <PlusCircle className="new-post-icon" />
      </div>
    );
  };

  public render(): JSX.Element {
    const { history } = this.props;
    const { loadedPosts } = this.state;

    return (
      <UserContext.Consumer>
        {({ isAuthorized }) => (
          <div
            className="home-page"
            ref={ref => {
              this.ref = ref;
            }}
          >
            {isAuthorized && <this.newPost />}
            {loadedPosts.map((post, i) => (
              <PostPreview
                key={(post._id as unknown) as string} // TODO
                id={(post._id as unknown) as string} // TODO
                title={post.title}
                created={new Date(post.createdAt)}
                lastModified={new Date(post.lastModified)}
                markdownText={post.markdownText}
                tags={post.tags}
                maxLength={MAX_PREVIEW_LENGTH}
                edit={() => history.push(`/posts/${post._id}/edit`)}
                delete={async () => {
                  await ClientApi.deletePost((post._id as unknown) as string); // TODO
                  delete loadedPosts[i];
                  this.setState({});
                }}
              />
            ))}
            {this.loadingMessage()}
          </div>
        )}
      </UserContext.Consumer>
    );
  }
}
