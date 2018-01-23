import "./styles/admin-page.less";
import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {User} from "./models/user";

type Props = {
  user: User | null;
} & RouteComponentProps<any>;

export class AdminPage extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    this.state = {user: null};
  }

  public componentDidMount(): void {
    if (!this.props.user) {
      this.props.history.push("/login");
    }
  }

  public render(): JSX.Element {
    return this.props.user ?
    <div className="admin-page">
      Welcome {this.props.user.username}
    </div> : <div/>;
  }
}
