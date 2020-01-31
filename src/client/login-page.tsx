import './styles/login-page.less';
import React from 'react';
import { Redirect, RouteComponentProps } from 'react-router-dom';
import { QRCode } from 'react-qr-svg';
import { ToastId } from 'react-toastify';
import * as ClientApi from './api/client-api';
import Button from './button';
import { User } from './models/user';
import { onError } from './utils';

type Props = {
  isAuthorized: boolean;
  onAuthenticated: (user: User, token: string) => void;
} & RouteComponentProps<any>;

type State = {
  authenticatorUrl?: string;
  challenge?: string;
  username: string;
  password: string;
  code: string;
};

function onEnter(
  func: React.KeyboardEventHandler<any>
): React.KeyboardEventHandler<any> {
  return evt => {
    if (evt.key === 'Enter') {
      func(evt);
    }
  };
}

export default class LoginPage extends React.Component<Props, State> {
  private toastId: ToastId;

  constructor(props: Props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      code: ''
    };
  }

  private passwordLogin = (): JSX.Element => {
    const { username, password } = this.state;
    return (
      <div>
        <h1>Sign in</h1>
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={ev => this.setState({ username: ev.target.value })}
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          onKeyPress={onEnter(this.submitPassword)}
          value={password}
          onChange={ev => this.setState({ password: ev.target.value })}
        />
        <Button text="Login" onClick={this.submitPassword} />
      </div>
    );
  };

  private authChallenge = (): JSX.Element => {
    const { authenticatorUrl, code } = this.state;
    return (
      <div>
        <h1>Two-Factor Authentication</h1>
        <div className="auth-challenge-content">
          {authenticatorUrl && <this.qrCode url={authenticatorUrl} />}
          <div className="auth-challenge-input">
            <input
              type="number"
              name="auth-code"
              placeholder="Enter authenticator code"
              value={code}
              onChange={ev => this.setState({ code: ev.target.value })}
              onKeyPress={onEnter(this.submitAuthCode)}
            />
            <Button text="Submit" onClick={this.submitAuthCode} />
          </div>
        </div>
      </div>
    );
  };

  private qrCode = (props: { url: string }): JSX.Element => (
    <div className="auth-challenge-qr">
      <p>First, scan this QR code into your authenticator app</p>
      <QRCode className="authenticator-qr" value={props.url} />
    </div>
  );

  private submitPassword = async (): Promise<void> => {
    const { username, password } = this.state;

    if (!username || !password) {
      return;
    }

    try {
      const { authenticatorUrl, challenge } = await ClientApi.getTempToken(
        username,
        password
      );
      this.setState({ authenticatorUrl, challenge });
    } catch (err) {
      this.toastId = onError(
        'Incorrect username or password',
        err,
        this.toastId
      );
    }
  };

  private submitAuthCode = async (): Promise<void> => {
    const { onAuthenticated, location, history } = this.props;
    const { code, challenge, username } = this.state;

    if (!code) {
      return;
    }

    try {
      const token = await ClientApi.getAuthToken(code, challenge!);
      onAuthenticated(
        {
          username
        },
        token
      );
      const { from = '/' } = (location.state as { from: string }) || {};
      history.replace(from);
    } catch (err) {
      this.toastId = onError('Incorrect auth code', err, this.toastId);
    }
  };

  public render(): JSX.Element {
    const { isAuthorized } = this.props;
    const { authenticatorUrl, challenge } = this.state;

    if (isAuthorized) {
      return <Redirect to="/" />;
    }

    if (!authenticatorUrl && !challenge) {
      return (
        <div className="login-page">
          <this.passwordLogin />
        </div>
      );
    }

    return (
      <div className="login-page">
        <this.authChallenge />
      </div>
    );
  }
}
