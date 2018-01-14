import "./styles/admin-page.less";
import * as React from "react";
import * as ClientApi from "./api/client-api";
import {QRCode} from "react-qr-svg";

type State = {
  authenticatorUrl?: string;
  token?: string;
};

export class AdminPage extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {};
  }

  public render(): JSX.Element {
    if (!this.state.authenticatorUrl && !this.state.token) {
      return <div className="admin-page">
        {this.renderPasswordLogin()}
      </div>
    } else if (this.state.authenticatorUrl) {
      return <div className="admin-page">
        {this.renderAuthenticatorQr()}
      </div>
    }

    return <div className="admin-page">
      {this.renderLoggedIn()}
    </div>
  }

  private renderPasswordLogin(): JSX.Element {
    return <div>
      <label htmlFor="password">Password:</label>
      <input id="password" type="password" name="password" />
      <button onClick={this.submitPassword}>Login</button>
    </div>;
  }

  private renderAuthenticatorQr(): JSX.Element {
    return <div>
      <QRCode className="authenticator-qr" value={this.state.authenticatorUrl!}/>
      <label htmlFor="auth-code">Authenticator Code:</label>
      <input id="auth-code" type="text" name="auth-code" />
      <button onClick={this.submitAuthCode}>Login</button>
    </div>;
  }

  private renderLoggedIn(): JSX.Element {
    return <div>Got token!</div>;
  }

  private submitPassword = async (): Promise<void> => {
    const passwordInput = document.getElementById("password")! as HTMLInputElement;
    const {authenticatorUrl, token} = await ClientApi.getTempToken(passwordInput.value);
    this.setState({authenticatorUrl, token});
  }

  private submitAuthCode = async (): Promise<void> => {
    const authCodeInput = document.getElementById("auth-code")! as HTMLInputElement;
    const token = await ClientApi.getAuthToken(authCodeInput.value, this.state.token!);
    this.setState({authenticatorUrl: undefined, token});
  };
}
