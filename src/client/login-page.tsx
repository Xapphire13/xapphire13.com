import "./styles/login-page.less";
import * as ClientApi from "./api/client-api";
import * as React from "react";
import { Redirect, RouteComponentProps } from "react-router-dom";
import { Button } from "./button";
import { QRCode } from "react-qr-svg";
import { User } from "./models/user";
import { onError } from "./utils";
import { ToastId } from "react-toastify";

type Props = {
  isAuthorized: boolean,
  onAuthenticated: (user: User, token: string) => void;
} & RouteComponentProps<any>;

type State = {
  authenticatorUrl?: string;
  challenge?: string;
  username: string;
  password: string;
  code: string;
};

export class LoginPage extends React.Component<Props, State> {
  public state: Readonly<State>;
  private toastId: ToastId;

  constructor(props: Props) {
    super(props);

    this.state = {
      username: "",
      password: "",
      code: ""
    };
  }

  public render(): JSX.Element {
    if (this.props.isAuthorized) {
      return <Redirect to="/" />;
    }

    if (!this.state.authenticatorUrl && !this.state.challenge) {
      return <div className="login-page">
        <this.passwordLogin />
      </div>;
    }

    return <div className="login-page">
      <this.authChallenge />
    </div>;
  }

  private passwordLogin = (): JSX.Element => <div>
    <h1>Sign in</h1>
    <input
      type="text"
      name="username"
      placeholder="Username"
      value={this.state.username}
      onChange={(ev) => this.setState({ username: ev.target.value })} />
    <input
      type="password"
      name="password"
      placeholder="Password"
      onKeyPress={this.onEnter(this.submitPassword)}
      value={this.state.password}
      onChange={(ev) => this.setState({ password: ev.target.value })} />
    <Button text="Login" onClick={this.submitPassword} />
  </div>

  private authChallenge = (): JSX.Element => <div>
    <h1>Two-Factor Authentication</h1>
    <div className="auth-challenge-content">
      {this.state.authenticatorUrl && <this.qrCode url={this.state.authenticatorUrl} />}
      <div className="auth-challenge-input">
        <input
          type="number"
          name="auth-code"
          placeholder="Enter authenticator code"
          value={this.state.code}
          onChange={(ev) => this.setState({ code: ev.target.value })}
          onKeyPress={this.onEnter(this.submitAuthCode)} />
        <Button text="Submit" onClick={this.submitAuthCode} />
      </div>
    </div>
  </div>

  private qrCode = (props: { url: string }): JSX.Element => <div className="auth-challenge-qr">
    <p>First, scan this QR code into your authenticator app</p>
    <QRCode className="authenticator-qr" value={props.url} />
  </div>

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
      const { authenticatorUrl, challenge } = await ClientApi.getTempToken(this.state.username, this.state.password);
      this.setState({ authenticatorUrl, challenge });
    } catch (err) {
      this.toastId = onError("Incorrect username or password", err, this.toastId);
    }
  }

  private submitAuthCode = async (): Promise<void> => {
    if (!this.state.code) {
      return;
    }

    try {
      const token = await ClientApi.getAuthToken(this.state.code, this.state.challenge!);
      this.props.onAuthenticated({
        username: this.state.username
      }, token);
      const { from = "/" } = this.props.location.state as { from: string } || {};
      this.props.history.replace(from);
    } catch (err) {
      this.toastId = onError("Incorrect auth code", err, this.toastId);
    }
  }
}
