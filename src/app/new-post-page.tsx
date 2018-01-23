import "./styles/new-post-page.less";
import "codemirror/lib/codemirror.css";
import * as React from "react";
import * as ReactMarkdown from "react-markdown";
import CodeMirror = require("react-codemirror");
require("codemirror/mode/markdown/markdown");

type State = {
  markdownText: string;
};

export class NewPostPage extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      markdownText: ""
    };
  }

  public render(): JSX.Element {
    return <div className="new-post-page">
      <input type="text" id="title" placeholder="Title..." />
      <CodeMirror
        value={this.state.markdownText}
        onChange={(value) => this.setState({markdownText: value})}
        options={{
          mode: "markdown",
          lineNumbers: true
        }}
      />
      <ReactMarkdown source={this.state.markdownText} />
    </div>;
  }
}
