import "./styles/home-page.less";
import * as ClientApi from "./api/client-api";
import * as React from "react";
import * as Utils from "./utils";
import {Disposable} from "./disposable";
import {PlusCircle} from "react-feather";
import {Post} from "xapphire13-entities";
import {PostPreview} from "./post-preview";
import {RouteComponentProps} from "react-router";
import {ScaleLoader} from "halogenium";
import {User} from "./models/user";
import throttle = require("throttleit");

const MAX_PREVIEW_LENGTH = 4000;

type Props = {
  user: User | null;
} & RouteComponentProps<any>;

type State = {
  loading: boolean;
  loadedPosts: Post[];
  allPostsLoaded: boolean;
};

export class HomePage extends React.Component<Props, State> {
  public state: Readonly<State>;

  private scrollSubscription: Disposable = {dispose: () => {}};
  private ref: HTMLDivElement | null;

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
      this.scrollSubscription = Utils.subscribeToEvent(window, "scroll", this.onScroll);
    }
  }

  public componentDidUpdate(_prevProps: Props, prevState: State): void {
    if (prevState.loading && !this.state.loading && !this.state.allPostsLoaded) {
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

  public render(): JSX.Element {
    return <div className="home-page" ref={ref => this.ref = ref}>
      {this.props.user && <this.newPost />}
      {this.state.loadedPosts.map((post, i) => <PostPreview
        key={post.id}
        id={post.id}
        title={post.title}
        created={new Date(post.created)}
        lastModified={new Date(post.lastModified)}
        markdownText={post.markdownText}
        tags={post.tags}
        maxLength={MAX_PREVIEW_LENGTH}
        edit={() => this.props.history.push(`/posts/${post.id}/edit`)}
        delete={async () => {
          await ClientApi.deletePost(post.id);
          delete this.state.loadedPosts[i];
          this.setState({});
        }} />)}
      {this.loadingMessage()}
    </div>;
  }

  private newPost = (): JSX.Element => <div className="new-post" title="New post" onClick={() => this.props.history.push("/posts/new")}>
    <PlusCircle className="new-post-icon"/>
  </div>

  private loadingMessage = (): JSX.Element | null => {
    if (this.state.allPostsLoaded) {
      if (this.state.loadedPosts.length === 0) {
        return <p className="post-loading-status">No posts to load...</p>;
      }

      return <p className="post-loading-status">Looks like you've reached the end...</p>;
    }

    if (this.state.loading) {
      return <div className="post-loading-status"><ScaleLoader /></div>;
    }

    return null;
  }

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

        const {loadedPosts} = this.state;
        this.setState({
          loading: true
        });

        const {continuationToken, values} = await ClientApi.getPosts(contToken);

        loadedPosts.push(...values);

        this.setState({
          loadedPosts,
          loading: false,
          allPostsLoaded: !continuationToken
        });

        return !!(contToken = continuationToken || null);
      } finally {
        currentlyLoading = false;
      }
    };
  })();

  private onScroll = throttle(async () => {
    const app = document.getElementById("app");
    if (app && window.innerHeight + window.scrollY + 200 >= app.offsetHeight) {
      if (!await this.loadPosts()) {
        this.scrollSubscription.dispose();
      }
    }
  }, 500);
}
