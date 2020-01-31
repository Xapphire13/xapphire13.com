import './styles/post-preview.less';
import React from 'react';
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
import UserContext from './user-context';
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

function copyShareLink(postPath: string): void {
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

export default class PostPreview extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      menuOpen: false
    };
  }

  public render(): JSX.Element {
    const {
      created,
      edit,
      delete: deletePost,
      id,
      lastModified,
      markdownText,
      maxLength,
      title,
      tags
    } = this.props;
    const { menuOpen } = this.state;

    const isEdited = created.getTime() !== lastModified.getTime();
    const isClipped = markdownText.length > maxLength;
    const lengthInMin = Math.floor(readingTime(markdownText).time / 1000 / 60);
    const postPath = `/posts/${id}`;

    return (
      <UserContext.Consumer>
        {({ isAuthorized }) => (
          <div className="post-preview">
            <div style={{ display: 'flex', flexDirection: 'row' }}>
              <Link className="post-title" to={postPath}>
                {title}
              </Link>
              <Menu
                right
                className="post-menu"
                isOpen={menuOpen}
                close={() => this.setState({ menuOpen: false })}
              >
                <MenuTrigger
                  onClick={() => this.setState({ menuOpen: !menuOpen })}
                >
                  <MenuIcon />
                </MenuTrigger>
                <MenuItem
                  visible={isAuthorized}
                  label="Edit"
                  icon={props => <Edit {...props} />}
                  onClick={() => edit()}
                />
                <MenuItem
                  visible={isAuthorized}
                  label="Delete"
                  icon={props => <Trash2 {...props} />}
                  onClick={() => {
                    deletePost();
                    this.setState({ menuOpen: false });
                  }}
                />
                <MenuItem
                  label="Share"
                  icon={props => <Share2 {...props} />}
                  onClick={() => copyShareLink(postPath)}
                />
              </Menu>
            </div>
            <div className="post-details">
              <span
                className="post-details-created"
                title={created.toLocaleString()}
              >
                <Clock className="icon" />
                {moment(created).fromNow()}
              </span>
              {isEdited && ' \u00B7 '}
              {isEdited && (
                <span
                  className="post-details-edited"
                  title={lastModified.toLocaleString()}
                >
                  <Edit className="icon" />
                  {moment(lastModified).fromNow()}
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
                source={markdownText.substr(0, maxLength)}
              />
              {isClipped && (
                <Link to={postPath} className="post-preview-read-more">
                  Read more
                </Link>
              )}
            </div>
            {tags && !!tags.length && (
              <div className="post-tags">
                {tags.map(tag => (
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
}
