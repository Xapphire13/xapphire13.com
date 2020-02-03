import '../styles/edit-post-page.less';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/gfm/gfm';
import 'codemirror/theme/material.css';
import 'react-tagsinput/react-tagsinput.css';
import React from 'react';
import { Save, Send } from 'react-feather';
import { Controlled as CodeMirror } from 'react-codemirror2';
import { RouteComponentProps } from 'react-router';
import { ToastId } from 'react-toastify';
import Button from '../button';
import CustomMarkdown from '../custom-markdown';
import { onError } from '../utils';
import * as ClientApi from '../api/client-api';

import TagsInput = require('react-tagsinput');

type Props = RouteComponentProps<{
  id: string;
}>;

type State = {
  title: string;
  tags: string[];
  markdownText: string;
  titleMissing: boolean;
};

export default class EditPostPage extends React.Component<Props, State> {
  private toastId: ToastId;

  constructor(props: Props) {
    super(props);

    this.state = {
      title: '',
      tags: [],
      markdownText: '',
      titleMissing: false
    };
  }

  public async componentDidMount(): Promise<void> {
    const { match } = this.props;
    const { id } = match.params;

    if (id) {
      try {
        const post = await ClientApi.getPost(id);

        this.setState({
          title: post.title,
          markdownText: post.markdownText,
          tags: post.tags
        });
      } catch {
        this.toastId = onError('Error loading post!', this.toastId);
      }
    }
  }

  private onCommit = async (): Promise<void> => {
    const { match, history } = this.props;
    const { title, markdownText, tags } = this.state;

    const titleMissing = !title;
    this.setState({ titleMissing });

    if (titleMissing) {
      this.toastId = onError("Title can't be empty", this.toastId);

      return;
    }

    const { id } = match.params;
    if (id) {
      try {
        await ClientApi.savePost(id, title, markdownText, tags);
        history.replace(`/posts/${id}`);
      } catch (err) {
        this.toastId = onError('Error saving post', err, this.toastId);
      }
    } else {
      try {
        const post = await ClientApi.createPost(title, markdownText, tags);
        history.replace(`/posts/${post._id}`);
      } catch (err) {
        this.toastId = onError('Error creating post', err, this.toastId);
      }
    }
  };

  public render(): JSX.Element {
    const { match } = this.props;
    const { markdownText, tags, title, titleMissing } = this.state;

    const isEdit = !!match.params.id;
    const commitText = isEdit ? 'Save' : 'Post';

    return (
      <div className="edit-post-page">
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <input
            type="text"
            id="title"
            className={titleMissing ? 'error' : ''}
            placeholder="Title..."
            value={title}
            onChange={ev => this.setState({ title: ev.target.value })}
          />
          <Button
            text={commitText}
            icon={props => (isEdit ? <Save {...props} /> : <Send {...props} />)}
            onClick={this.onCommit}
          />
        </div>
        <TagsInput
          value={tags}
          onChange={value => this.setState({ tags: value })}
        />
        <CodeMirror
          value={markdownText}
          onBeforeChange={(_editor, _data, value) =>
            this.setState({ markdownText: value })
          }
          options={{
            mode: 'gfm',
            lineNumbers: true,
            theme: 'material'
          }}
        />
        <CustomMarkdown className="markdown" source={markdownText} />
      </div>
    );
  }
}
