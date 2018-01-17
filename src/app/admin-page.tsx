import "./styles/admin-page.less";
import * as React from "react";
import * as ClientApi from "./api/client-api";
import {QRCode} from "react-qr-svg";

type State = {
  authenticatorUrl?: string;
  tempToken?: string;
  isAdmin: boolean;
};

export class AdminPage extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {isAdmin: false};
  }

  public render(): JSX.Element {
    if (!this.state.isAdmin && !this.state.authenticatorUrl && !this.state.tempToken) {
      return <div className="admin-page">
        {this.renderPasswordLogin()}
      </div>
    } else if (this.state.tempToken) {
      return <div className="admin-page">
        {this.renderAuthCode()}
      </div>
    }

    return <div className="admin-page">
      {this.renderLoggedIn()}
    </div>
  }

  private renderPasswordLogin(): JSX.Element {
    return <div>
      <label htmlFor="username">Username:</label>
      <input id="username" type="text" name="username" />
      <label htmlFor="password">Password:</label>
      <input id="password" type="password" name="password" />
      <button onClick={this.submitPassword}>Login</button>
    </div>;
  }

  private renderAuthCode(): JSX.Element {
    return <div>
      {this.state.authenticatorUrl && <QRCode className="authenticator-qr" value={this.state.authenticatorUrl}/>}
      <label htmlFor="auth-code">Authenticator Code:</label>
      <input id="auth-code" type="text" name="auth-code" />
      <button onClick={this.submitAuthCode}>Login</button>
    </div>;
  }

  private renderLoggedIn(): JSX.Element {
    return <div>Got token!</div>;
  }

  private submitPassword = async (): Promise<void> => {
    const usernameInput = document.getElementById("username")! as HTMLInputElement;
    const passwordInput = document.getElementById("password")! as HTMLInputElement;
    const {authenticatorUrl, tempToken} = await ClientApi.getTempToken(usernameInput.value, passwordInput.value);
    this.setState({authenticatorUrl, tempToken});
  }

  private submitAuthCode = async (): Promise<void> => {
    const authCodeInput = document.getElementById("auth-code")! as HTMLInputElement;
    await ClientApi.getAuthToken(authCodeInput.value, this.state.tempToken!);
    this.setState({authenticatorUrl: undefined, tempToken: undefined, isAdmin: true});
  };
}
