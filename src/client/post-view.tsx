import './styles/post-view.less';
import React from 'react';
import { BookOpen, Clock, Edit } from 'react-feather';
import DisqusThread from 'react-disqus-comments';
import { RouteComponentProps } from 'react-router-dom';
import moment from 'moment';
import NotFound from './not-found';
import CustomMarkdown from './custom-markdown';
import * as ClientApi from './api/client-api';
import Post from ':models/post';

import readingTime = require('reading-time');

type Params = {
  id: string;
};

type Props = RouteComponentProps<Params>;

type State = {
  post: Post | null;
  error: boolean;
};

function getThreadUrl(post: Post): string {
  return `http://www.xapphire13.com/posts/${post._id}`;
}

export default class PostView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      post: null,
      error: false
    };
  }

  public async componentDidMount(): Promise<void> {
    const { match } = this.props;
    window.scrollTo(0, 0);

    try {
      const post = await ClientApi.getPost(match.params.id);
      this.setState({ post });
    } catch {
      this.setState({ error: true });
    }
  }

  public render(): JSX.Element {
    const { error, post } = this.state;

    if (error) {
      return <NotFound message="404: Post not found" />;
    }

    if (!post) {
      return <div className="post-view">Loading...</div>;
    }

    const isEdited = post.createdAt !== post.lastModified;
    const lengthInMin = Math.floor(
      readingTime(post.markdownText).time / 1000 / 60
    );

    return (
      <div className="post-view">
        <div className="post-title">{post.title}</div>
        <div className="post-details">
          <span
            className="post-details-created"
            title={post.createdAt.toLocaleString()}
          >
            <Clock className="icon" />
            {moment(post.createdAt).fromNow()}
          </span>
          {isEdited && ' \u00B7 '}
          {isEdited && (
            <span
              className="post-details-edited"
              title={post.lastModified.toLocaleString()}
            >
              <Edit className="icon" />
              {moment(post.lastModified).fromNow()}
            </span>
          )}
          {' \u00B7 '}
          <span className="post-details-length">
            <BookOpen className="icon" />
            {lengthInMin >= 1 ? `${lengthInMin} min` : 'short'} read
          </span>
        </div>
        <div className="post-content">
          <CustomMarkdown className="markdown" source={post.markdownText} />
        </div>
        {post.tags && !!post.tags.length && (
          <div className="post-tags">
            {post.tags.map(tag => (
              <span key={tag} className="post-tag">
                {tag}
              </span>
            ))}
          </div>
        )}
        <DisqusThread
          className="disqus-thread"
          shortname="xapphire13"
          identifier={(post._id as unknown) as string} // TODO
          title={post.title}
          url={getThreadUrl(post)}
        />
      </div>
    );
  }
}
