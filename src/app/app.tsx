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
import {AuthManager} from "./auth-manager";
import GitHubButton = require("react-github-button");

type State = {
  user: User | null;
};

export const App = withRouter(class App extends React.Component<RouteComponentProps<any>, State> {
  private authManager = new AuthManager();

  constructor(props: any) {
    super(props);

    this.state = {
      user: this.authManager.user
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
            <Route path="/admin" render={(props) => <AdminPage user={this.state.user} {...props} />} />
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
    this.authManager.onSignedIn(user.username, token);
    this.setState({user});
    this.props.history.goBack();
  }
});
