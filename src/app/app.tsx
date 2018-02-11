import "./styles/app.less";
import * as React from "react";
import {Route, Switch} from "react-router-dom";
import {AdminPage} from "./admin-page";
import {AppHeader} from "./app-header";
import {AuthManager} from "./auth-manager";
import {EditPostPage} from "./edit-post-page";
import {Github} from "react-feather";
import {HomePage} from "./home-page";
import {LoginPage} from "./login-page";
import {NotFound} from "./not-found";
import {PostView} from "./post-view";
import {ProjectsPage} from "./projects-page";
import {ProtectedRoute} from "./route-helpers";
import {User} from "./models/user";

type Props = {
  authManager: AuthManager
};

type State = {
  user: User | null;
  isAuthorized: boolean;
  loading: boolean;
};

export class App extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      user: null,
      isAuthorized: false,
      loading: true
    };

    Promise.all([
      this.props.authManager.user,
      this.props.authManager.isAuthorized
    ]).then(([user, isAuthorized]) => {
      this.setState({
        user,
        isAuthorized,
        loading: false
      });
    });
  }

  public render(): JSX.Element {
    if (this.state.loading) {
      return <div />;
    }

    return <div id="app">
      <AppHeader />
      <div className="app-content-wrapper">
        <div className="app-content">
          <Switch>
            <Route exact path="/" render={(props) => <HomePage user={this.state.user} {...props} />} />
            <ProtectedRoute path="/posts/new" component={EditPostPage} isAuthorized={this.state.isAuthorized} />
            <Route exact path="/posts/:id" component={PostView} />
            <ProtectedRoute path="/posts/:id/edit" component={EditPostPage} isAuthorized={this.state.isAuthorized} />
            <ProtectedRoute path="/admin" render={(props) => <AdminPage user={this.state.user!} {...props} />} isAuthorized={this.state.isAuthorized} />
            <Route path="/login" render={(props) => <LoginPage {...props} onAuthenticated={this.onAuthenticated} isAuthorized={this.state.isAuthorized} />} />
            <Route path="/projects" component={ProjectsPage} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
      <footer className="app-footer">
        <a href="https://github.com/xapphire13/xapphire13.com" target="_blank" className="github-link">
          <Github style={{position: "relative", top: "5px", marginRight: "0.3em"}} />GitHub
        </a>
      </footer>
    </div>;
  }

  private onAuthenticated = (user: User, token: string): Promise<void> => this.props.authManager.onSignedIn(user.username, token);
}
