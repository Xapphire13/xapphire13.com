import "./styles/admin-page.less";
import * as React from "react";
import {UserSignIn} from "./user-sign-in";

type State = {
  user: any;
};

export class AdminPage extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {user: null};
  }

  public render(): JSX.Element {
    return <div className="admin-page">
      {this.state.user ?
        <div></div> :
        <UserSignIn />}
    </div>;
  }
}
