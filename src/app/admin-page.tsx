import "./styles/admin-page.less";
import * as React from "react";
import {Redirect} from "react-router-dom";
import {User} from "./models/user";

type Props = {
  user?: User;
};

export class AdminPage extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {user: null};
  }

  public render(): JSX.Element {
    return this.props.user ?
    <div className="admin-page">
      Welcome {this.props.user.username}
    </div> :
    <Redirect to="/login"/>;
  }
}
