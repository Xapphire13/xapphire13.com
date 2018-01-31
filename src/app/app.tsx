import "./styles/app.less";
import "react-github-button/assets/style.less";
import * as React from "react";
import {Route, RouteComponentProps, Switch} from "react-router-dom";
import {AdminPage} from "./admin-page";
import {AppHeader} from "./app-header";
import {AuthManager} from "./auth-manager";
import {EditPostPage} from "./edit-post-page";
import {HomePage} from "./home-page";
import {LoginPage} from "./login-page";
import {NotFound} from "./not-found";
import {PostView} from "./post-view";
import {ProtectedRoute} from "./route-helpers";
import {User} from "./models/user";
import GitHubButton = require("react-github-button");

export class App extends React.Component<RouteComponentProps<any>> {
  private authManager = new AuthManager();

  public render(): JSX.Element {
    return <div id="app">
      <AppHeader />
      <div className="app-content-wrapper">
        <div className="app-content">
          <Switch>
            <Route exact path="/" render={(props) => <HomePage user={this.authManager.user} {...props} />} />
            <ProtectedRoute path="/posts/new" component={EditPostPage} isAuthorized={this.authManager.isAuthorized} />
            <Route exact path="/posts/:id" component={PostView} />
            <ProtectedRoute path="/posts/:id/edit" component={EditPostPage} isAuthorized={this.authManager.isAuthorized} />
            <ProtectedRoute path="/admin" render={(props) => <AdminPage user={this.authManager.user!} {...props} />} isAuthorized={this.authManager.isAuthorized} />
            <Route path="/login" render={(props) => <LoginPage {...props} onAuthenticated={this.onAuthenticated} isAuthorized={this.authManager.isAuthorized} />} />
            <Route component={NotFound} />
          </Switch>
        </div>
      </div>
      <footer className="app-footer">
        <GitHubButton type="forks" size="large" namespace="xapphire13" repo="xapphire13.com" />
      </footer>
    </div>;
  }

  private onAuthenticated = (user: User, token: string): void => this.authManager.onSignedIn(user.username, token);
}
