import "./styles/new-post-page.less";
import "codemirror/lib/codemirror.css";
import "react-tagsinput/react-tagsinput.css";
import * as React from "react";
import * as ReactMarkdown from "react-markdown";
import {Send} from "react-feather";
import CodeMirror = require("react-codemirror");
import TagsInput = require("react-tagsinput");
require("codemirror/mode/markdown/markdown");

type State = {
  title: string;
  tags: string[];
  markdownText: string;
  titleMissing: boolean;
};

export class NewPostPage extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      title: "",
      tags: [],
      markdownText: "",
      titleMissing: false
    };
  }

  public render(): JSX.Element {
    return <div className="new-post-page">
      {this.state.titleMissing && <div className="error-message">Title can't be empty</div>}
      <div style={{display: "flex", flexDirection: "row"}}>
        <input
          type="text"
          id="title"
          className={this.state.titleMissing ? "error" : ""}
          placeholder="Title..."
          value={this.state.title}
          onChange={ev => this.setState({title: ev.target.value})}/>
          <button onClick={this.onSubmit}>
            <span className="button-text">Post</span><Send className="button-icon" />
          </button>
      </div>
      <TagsInput value={this.state.tags} onChange={tags => this.setState({tags})}/>
      <CodeMirror
        value={this.state.markdownText}
        onChange={value => this.setState({markdownText: value})}
        options={{
          mode: "markdown",
          lineNumbers: true
        }}
      />
      <ReactMarkdown source={this.state.markdownText} />
    </div>;
  }

  private onSubmit = (): void => {
    const titleMissing = !this.state.title;
    this.setState({titleMissing});

    if (titleMissing) {
      return;
    }
  }
}
