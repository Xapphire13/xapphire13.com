import "./styles/admin-page.less";
import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {User} from "./models/user";

type Props = {
  user: User;
} & RouteComponentProps<any>;

export class AdminPage extends React.Component<Props> {
  constructor(props: Props) {
    super(props);
  }

  public render(): JSX.Element {
    return <div className="admin-page">
      Welcome {this.props.user.username}
    </div>;
  }
}
