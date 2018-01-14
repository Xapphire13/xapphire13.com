import "./styles/admin-page.less";
import * as React from "react";
import * as ClientApi from "./api/client-api";
import {QRCode} from "react-qr-svg";

type State = {
  authenticatorUrl?: string;
};

export class AdminPage extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {};
  }

  public render(): JSX.Element {
    return <div className="admin-page">
      {this.state.authenticatorUrl ?
        <div>
          <QRCode className="authenticator-qr" value={this.state.authenticatorUrl}/>
        </div> :
        <div>
          <label htmlFor="password">Password:</label>
          <input id="password" type="password" name="password" />
          <button onClick={this.submitPassword}>Login</button>
        </div>
      }
    </div>
  }

  public submitPassword = async (): Promise<void> => {
    const passwordInput = document.getElementById("password")! as HTMLInputElement;
    const {authenticatorUrl} = await ClientApi.getTempToken(passwordInput.value);
    this.setState({authenticatorUrl});
  }
}
