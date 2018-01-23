import "./styles/login-page.less";
import * as React from "react";
import * as ClientApi from "./api/client-api";
import {User} from "./models/user";
import {QRCode} from "react-qr-svg";
import {MessageBar} from "./message-bar";

type Props = {
  onAuthenticated: (user: User, token: string) => void;
};

type State = {
  authenticatorUrl?: string;
  challenge?: string;
  username: string;
  password: string;
  code: string;
  error: boolean;
}

export class LoginPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      code: "",
      error: false
    };
  }

  public render(): JSX.Element {
    if (!this.state.authenticatorUrl && !this.state.challenge) {
      return <div className="login-page">
        {this.state.error && <MessageBar type="error" message="Incorrect username or password" />}
        <this.passwordLogin />
      </div>
    }

    return <div className="login-page">
      {this.state.error && <MessageBar type="error" message="Incorrect code" />}
      <this.authChallenge />
    </div>
  }

  private passwordLogin = (): JSX.Element => {
    return <div>
      <h1>Sign in</h1>
      <input
        type="text"
        name="username"
        placeholder="Username"
        value={this.state.username}
        onChange={(ev) => this.setState({username: ev.target.value})} />
      <input
        type="password"
        name="password"
        placeholder="Password"
        onKeyPress={this.onEnter(this.submitPassword)}
        value={this.state.password}
        onChange={(ev) => this.setState({password: ev.target.value})} />
      <button onClick={this.submitPassword}>Login</button>
    </div>;
  }

  private authChallenge = (): JSX.Element => {
    return <div>
      <h1>Two-Factor Authentication</h1>
      <div className="auth-challenge-content">
        {this.state.authenticatorUrl && <this.qrCode url={this.state.authenticatorUrl} />}
        <div className="auth-challenge-input">
          <input
            type="number"
            name="auth-code"
            placeholder="Enter authenticator code"
            value={this.state.code}
            onChange={(ev) => this.setState({code: ev.target.value})}
            onKeyPress={this.onEnter(this.submitAuthCode)} />
          <button onClick={this.submitAuthCode}>Submit</button>
        </div>
      </div>
    </div>;
  }

  private qrCode = (props: {url: string}): JSX.Element => {
    return <div className="auth-challenge-qr">
      <p>First, scan this QR code into your authenticator app</p>
      <QRCode className="authenticator-qr" value={props.url} />
    </div>;
  }

  private onEnter(func: React.KeyboardEventHandler<any>): React.KeyboardEventHandler<any> {
    return (evt) => {
      if (evt.key === "Enter") {
        return func(evt);
      }
    };
  }

  private submitPassword = async (): Promise<void> => {
    if (!this.state.username || !this.state.password) {
      return;
    }

    try {
      const {authenticatorUrl, challenge} = await ClientApi.getTempToken(this.state.username, this.state.password);
      this.setState({authenticatorUrl, challenge, error: false});
    } catch (err) {
      console.error(err);
      this.setState({error: true});
    }
  }

  private submitAuthCode = async (): Promise<void> => {
    if (!this.state.code) {
      return;
    }

    try {
      const token = await ClientApi.getAuthToken(this.state.code, this.state.challenge!);
      this.setState({error: false});
      this.props.onAuthenticated({
        username: this.state.username
      }, token);
    } catch (err) {
      console.error(err);
      this.setState({error: true});
    }
  };
}
