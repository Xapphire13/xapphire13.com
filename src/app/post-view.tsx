import "./styles/post-view.less"
import * as React from "react";
import * as moment from "moment";
import * as ReactMarkdown from "react-markdown";
import * as ClientApi from "./client-api";
import {RouteComponentProps} from "react-router-dom";
import {BookOpen, Clock, Edit} from "react-feather";
import {Post} from "./post";
import readingTime = require("reading-time");
import DisqusThread from "react-disqus-comments";

type Params = {
  id: string;
};

type Props = RouteComponentProps<Params>;

type State = {
  post: Post | null;
};

export class PostView extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      post: null
    }
  }

  public async componentDidMount(): Promise<void> {
    window.scrollTo(0, 0);
    const post = await ClientApi.getPost(this.props.match.params.id);

    this.setState({post});
  }

  public render(): JSX.Element {
    if (!this.state.post) {
      return <div className="post-view">
        Loading...
      </div>;
    }

    const isEdited = this.state.post.created.getTime() !== this.state.post.lastModified.getTime();
    const lengthInMin = Math.floor(readingTime(this.state.post.markdownText).time / 1000 / 60);

    return <div className="post-view">
      <div className="post-title">{this.state.post.title}</div>
      <div className="post-details">
        <span className="post-details-created" title={this.state.post.created.toLocaleString()}>
          <Clock className="icon" />{moment(this.state.post.created).fromNow()}
        </span>
        {isEdited && " \u00B7 "}
        {isEdited && <span className="post-details-edited" title={this.state.post.lastModified.toLocaleString()}>
          <Edit className="icon" />{moment(this.state.post.lastModified).fromNow()}
        </span>}
        {" \u00B7 "}
        <span className="post-details-length"><BookOpen className="icon" />{lengthInMin >= 1 ? `${lengthInMin} min` : "short"} read</span>
      </div>
      <div className={`post-content`}>
        <ReactMarkdown className="post-preview-markdown" source={this.state.post.markdownText}/>
      </div>
      {this.state.post.tags && !!this.state.post.tags.length && <div className="post-tags">
        {this.state.post.tags.map(tag => <span key={tag} className="post-tag">{tag}</span>)}
      </div>}
      <DisqusThread
        className="disqus-thread"
        shortname="xapphire13"
        identifier={this.state.post.id}
        title={this.state.post.title}
        url={this.getThreadUrl(this.state.post)}/>
    </div>;
  }

  private getThreadUrl(post: Post): string {
    return `http://www.xapphire13.com/posts/${post.id}`;
  }
}
