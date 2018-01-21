import "./styles/user-sign-in.less";
import * as React from "react";
import * as ClientApi from "./api/client-api";
import {QRCode} from "react-qr-svg";

type State = {
  authenticatorUrl?: string;
  challenge?: string;
}

export class UserSignIn extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {};
  }

  public render(): JSX.Element {
    if (!this.state.authenticatorUrl && !this.state.challenge) {
      return <div className="user-sign-in">
        <this.passwordLogin />
      </div>
    }

    return <div className="user-sign-in">
      <this.authChallenge />
    </div>
  }

  private passwordLogin = (): JSX.Element => {
    return <div>
      <h1>Sign in</h1>
      <input id="username" type="text" name="username" placeholder="Username" />
      <input id="password" type="password" name="password" placeholder="Password" onKeyPress={this.onEnter(this.submitPassword)} />
      <button onClick={this.submitPassword}>Login</button>
    </div>;
  }

  private authChallenge = (): JSX.Element => {
    return <div>
      <h1>Two-Factor Authentication</h1>
      <div className="auth-challenge-content">
        {this.state.authenticatorUrl && <this.qrCode url={this.state.authenticatorUrl} />}
        <div className="auth-challenge-input">
          <input id="auth-code" type="number" name="auth-code" placeholder="Enter authenticator code" onKeyPress={this.onEnter(this.submitAuthCode)} />
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
    const usernameInput = document.getElementById("username")! as HTMLInputElement;
    const passwordInput = document.getElementById("password")! as HTMLInputElement;
    const {authenticatorUrl, challenge} = await ClientApi.getTempToken(usernameInput.value, passwordInput.value);
    this.setState({authenticatorUrl, challenge});
  }

  private submitAuthCode = async (): Promise<void> => {
    const authCodeInput = document.getElementById("auth-code")! as HTMLInputElement;
    await ClientApi.getAuthToken(authCodeInput.value, this.state.challenge!);
    this.setState({authenticatorUrl: undefined, challenge: undefined});
  };
}
