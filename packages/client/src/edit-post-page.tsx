import "./styles/edit-post-page.less";
import "codemirror/lib/codemirror.css";
import "codemirror/mode/gfm/gfm";
import "codemirror/theme/material.css";
import "react-tagsinput/react-tagsinput.css";
import * as ClientApi from "./api/client-api";
import * as React from "react";
import {Save, Send} from "react-feather";
import {Button} from "./button";
import {Controlled as CodeMirror} from "react-codemirror2";
import CustomMarkdown from "./custom-markdown";
import {MessageBar} from "./message-bar";
import {RouteComponentProps} from "react-router";
import TagsInput = require("react-tagsinput");

type Props = RouteComponentProps<{
  id: string;
}>;

type State = {
  title: string;
  tags: string[];
  markdownText: string;
  titleMissing: boolean;
  errorText: string;
};

export class EditPostPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      title: "",
      tags: [],
      markdownText: "",
      titleMissing: false,
      errorText: ""
    };
  }

  public async componentDidMount(): Promise<void> {
    const {id} = this.props.match.params;

    if (id) {
      try {
        const post = await ClientApi.getPost(id);

        this.setState({
          title: post.title,
          markdownText: post.markdownText,
          tags: post.tags
        });
      } catch {
        this.setState({errorText: "Error loading post!"});
      }
    }
  }

  public render(): JSX.Element {
    const isEdit = !!this.props.match.params.id;
    const commitText = isEdit ? "Save" : "Post";

    return <div className="edit-post-page">
      {this.state.errorText && <MessageBar type="error" message={this.state.errorText} />}
      <div style={{display: "flex", flexDirection: "row"}}>
        <input
          type="text"
          id="title"
          className={this.state.titleMissing ? "error" : ""}
          placeholder="Title..."
          value={this.state.title}
          onChange={ev => this.setState({title: ev.target.value})}/>
          <Button text={commitText} icon={(props) => isEdit ? <Save {...props} /> : <Send {...props} />} onClick={this.onCommit} />
      </div>
      <TagsInput value={this.state.tags} onChange={tags => this.setState({tags})}/>
      <CodeMirror
        value={this.state.markdownText}
        onBeforeChange={(_editor, _data, value) => this.setState({markdownText: value})}
        options={{
          mode: "gfm",
          lineNumbers: true,
          theme: "material"
        }}
      />
      <CustomMarkdown className="markdown" source={this.state.markdownText} />
    </div>;
  }

  private onCommit = async (): Promise<void> => {
    const titleMissing = !this.state.title;
    this.setState({titleMissing});

    if (titleMissing) {
      this.setState({errorText: "Title can't be empty"});

      return;
    }

    const {title, markdownText, tags} = this.state;

    const {id} = this.props.match.params;
    if (id) {
      try {
        await ClientApi.savePost(id, title, markdownText, tags);
        this.props.history.replace(`/posts/${id}`);
      } catch (err) {
        console.error(err);
        this.setState({errorText: "Error saving post"});
      }
    } else {
      try {
        const post = await ClientApi.createPost(title, markdownText, tags);
        this.props.history.replace(`/posts/${post.id}`);
      } catch (err) {
        console.error(err);
        this.setState({errorText: "Error creating post"});
      }
    }
  }
}
