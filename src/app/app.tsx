import "./styles/app.less";
import "react-github-button/assets/style.less";
import * as React from "react";
import {AppHeader} from "./app-header";
import {withRouter, Route, Switch, RouteComponentProps} from "react-router-dom";
import {HomePage} from "./home-page";
import {NotFound} from "./not-found";
import {PostView} from "./post-view";
import {AdminPage} from "./admin-page";
import {LoginPage} from "./login-page";
import {User} from "./models/user";
import GitHubButton = require("react-github-button");

type State = {
  user?: User;
};

export const App = withRouter(class App extends React.Component<RouteComponentProps<any>, State> {
  constructor(props: any) {
    super(props);

    const username = window.localStorage.getItem("username");
    this.state = {
      user: username ? {
        username
      } : undefined
    };
  }

  public render(): JSX.Element {
    return <div id="app">
      <AppHeader />
      <div className="app-content-wrapper">
        <div className="app-content">
          <Switch>
            <Route exact path="/" component={HomePage} />
            <Route path="/posts/:id" component={PostView} />
            <Route path="/admin" render={() => <AdminPage user={this.state.user} />} />
            <Route path="/login" render={() => <LoginPage onAuthenticated={this.onAuthenticated} />} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
      <footer className="app-footer">
        <GitHubButton type="forks" size="large" namespace="xapphire13" repo="xapphire13.com" />
      </footer>
    </div>;
  }

  private onAuthenticated = (user: User, token: string): void => {
    window.localStorage.setItem("username", user.username);
    window.localStorage.setItem("token", token);
    this.setState({user});
    this.props.history.replace("/admin");
  }
});
