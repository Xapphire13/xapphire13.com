import "./styles/post-preview.less";
import * as React from "react";
import * as moment from "moment";
import * as ReactMarkdown from "react-markdown";
import {BookOpen, Clock, Edit} from "react-feather";
import readingTime = require("reading-time");

type Props = {
  title: string;
  created: Date;
  lastModified: Date;
  markdownText: string;
  tags?: string[];
  maxLength: number
};

export class PostPreview extends React.Component<Props> {
  public render(): JSX.Element {
    const isEdited = this.props.created.getTime() !== this.props.lastModified.getTime();
    const isClipped = this.props.markdownText.length > this.props.maxLength;
    const lengthInMin = Math.floor(readingTime(this.props.markdownText).time / 1000 / 60);

    return <div className="post-preview">
      <div className="post-title">{this.props.title}</div>
      <div className="post-details">
        <span className="post-details-created" title={this.props.created.toLocaleString()}>
          <Clock className="icon" />{moment(this.props.created).fromNow()}
        </span>
        {isEdited && " \u00B7 "}
        {isEdited && <span className="post-details-edited" title={this.props.lastModified.toLocaleString()}>
          <Edit className="icon" />{moment(this.props.lastModified).fromNow()}
        </span>}
        {" \u00B7 "}
        <span className="post-details-length"><BookOpen className="icon" />{lengthInMin >= 1 ? `${lengthInMin} min` : "short"} read</span>
      </div>
      <div className={`post-preview-content ${isClipped ? "post-clipped" : ""}`}>
        <ReactMarkdown source={this.props.markdownText.substr(0, this.props.maxLength)}/>
        {isClipped && <div className="post-preview-read-more">Read more</div>}
      </div>
      {this.props.tags && !!this.props.tags.length && <div className="post-tags">
        {this.props.tags.map(tag => <span key={tag} className="post-tag">{tag}</span>)}
      </div>}
    </div>;
  }
}
