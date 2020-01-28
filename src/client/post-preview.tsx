import './styles/post-preview.less';
import * as React from 'react';
import {
  BookOpen,
  Clock,
  Edit,
  Menu as MenuIcon,
  Share2,
  Trash2
} from 'react-feather';
import ClipboardJS from 'clipboard';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import { UserContext } from './user-context';
import CustomMarkdown from './custom-markdown';
import { Menu, MenuItem, MenuTrigger } from './menu';

import readingTime = require('reading-time');

type Props = {
  id: string;
  title: string;
  created: Date;
  lastModified: Date;
  markdownText: string;
  tags?: string[];
  maxLength: number;
  delete: () => void;
  edit: () => void;
};

type State = {
  menuOpen: boolean;
};

export class PostPreview extends React.Component<Props, State> {
  public state: Readonly<State>;

  constructor(props: Props) {
    super(props);

    this.state = {
      menuOpen: false
    };
  }

  public render(): JSX.Element {
    const isEdited =
      this.props.created.getTime() !== this.props.lastModified.getTime();
    const isClipped = this.props.markdownText.length > this.props.maxLength;
    const lengthInMin = Math.floor(
      readingTime(this.props.markdownText).time / 1000 / 60
    );
    const postPath = `/posts/${this.props.id}`;

    return (
      <UserContext.Consumer>
        {({ isAuthorized }) => (
          <div className="post-preview">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Link className="post-title" to={postPath}>
                {this.props.title}
              </Link>
              <Menu
                right
                className="post-menu"
                isOpen={this.state.menuOpen}
                close={() => this.setState({ menuOpen: false })}
              >
                <MenuTrigger
                  onClick={() =>
                    this.setState({ menuOpen: !this.state.menuOpen })
                  }
                >
                  <MenuIcon />
                </MenuTrigger>
                <MenuItem
                  visible={isAuthorized}
                  label="Edit"
                  icon={props => <Edit {...props} />}
                  onClick={() => this.props.edit()}
                />
                <MenuItem
                  visible={isAuthorized}
                  label="Delete"
                  icon={props => <Trash2 {...props} />}
                  onClick={() => {
                    this.props.delete();
                    this.setState({ menuOpen: false });
                  }}
                />
                <MenuItem
                  label="Share"
                  icon={props => <Share2 {...props} />}
                  onClick={() => this.copyShareLink(postPath)}
                />
              </Menu>
            </div>
            <div className="post-details">
              <span
                className="post-details-created"
                title={this.props.created.toLocaleString()}
              >
                <Clock className="icon" />
                {moment(this.props.created).fromNow()}
              </span>
              {isEdited && ' \u00B7 '}
              {isEdited && (
                <span
                  className="post-details-edited"
                  title={this.props.lastModified.toLocaleString()}
                >
                  <Edit className="icon" />
                  {moment(this.props.lastModified).fromNow()}
                </span>
              )}
              {' \u00B7 '}
              <span className="post-details-length">
                <BookOpen className="icon" />
                {lengthInMin >= 1 ? `${lengthInMin} min` : 'short'} read
              </span>
            </div>
            <div
              className={`post-preview-content ${
                isClipped ? 'post-clipped' : ''
              }`}
            >
              <CustomMarkdown
                className="post-preview-markdown markdown"
                source={this.props.markdownText.substr(0, this.props.maxLength)}
              />
              {isClipped && (
                <Link to={postPath} className="post-preview-read-more">
                  Read more
                </Link>
              )}
            </div>
            {this.props.tags && !!this.props.tags.length && (
              <div className="post-tags">
                {this.props.tags.map(tag => (
                  <span key={tag} className="post-tag">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        )}
      </UserContext.Consumer>
    );
  }

  private copyShareLink(postPath: string): void {
    const btn = document.createElement('button');
    const clipboard = new ClipboardJS(btn, {
      text: () => `${document.location.origin}${postPath}`
    });
    btn.click();
    clipboard.destroy();
    btn.remove();
    toast.info('Link copied to clipboard!', {
      autoClose: 2000
    });
  }
}
