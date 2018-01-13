import "./styles/admin-page.less";
import * as React from "react";
import * as ClientApi from "./api/client-api";

export class AdminPage extends React.Component {
  public render(): JSX.Element {
    return <div className="admin-page">
      <label htmlFor="password">Password:</label>
      <input id="password" type="password" name="password" />
      <button onClick={this.submitPassword}>Login</button>
    </div>
  }

  public submitPassword(): void {
    const passwordInput = document.getElementById("password")! as HTMLInputElement;
    ClientApi.getTempToken(passwordInput.value);
  }
}
