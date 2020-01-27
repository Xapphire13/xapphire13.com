import "./styles/app.less";
import "react-toastify/dist/ReactToastify.css";
import * as React from "react";
import { Route, RouteComponentProps, Switch, withRouter } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { AdminPage } from "./admin-page";
import { AppHeader } from "./app-header";
import { AuthManager } from "./auth-manager";
import { EditPostPage } from "./edit-post-page";
import { GitHub } from "react-feather";
import { HomePage } from "./home-page";
import { LoginPage } from "./login-page";
import { NotFound } from "./not-found";
import { PlaygroundPage } from "./playground-page";
import { PostView } from "./post-view";
import { ProjectsPage } from "./projects-page";
import { ProtectedRoute } from "./route-helpers";
import { User } from "./models/user";
import { UserContext } from "./user-context";

type Props = {
  authManager: AuthManager
} & RouteComponentProps<any>;

type State = {
  user: User | null;
  isAuthorized: boolean;
  loading: boolean;
};

// tslint:disable-next-line variable-name
export const App = withRouter(class App extends React.Component<Props, State> {
  public state: Readonly<State>;

  constructor(props: Props) {
    super(props);

    this.state = {
      user: null,
      isAuthorized: false,
      loading: true
    };

    this.props.history.listen(() => this.onNavigate());
  }

  public componentDidMount(): void {
    Promise.all([
      this.props.authManager.user,
      this.props.authManager.isAuthorized
    ]).then(([user, isAuthorized]) => {
      this.setState({
        user,
        isAuthorized: isAuthorized ?? false,
        loading: false
      });
    });
  }

  public render(): JSX.Element {
    if (this.state.loading) {
      return <div />;
    }

    return <UserContext.Provider value={this.state}>
      <div id="app">
        <ToastContainer />
        <AppHeader />
        <div className="app-content-wrapper">
          <div className="app-content">
            <Switch>
              <Route exact path="/" render={(props) => <HomePage {...props} />} />
              <ProtectedRoute path="/posts/new" component={EditPostPage} isAuthorized={this.state.isAuthorized} />
              <Route exact path="/posts/:id" component={PostView} />
              <ProtectedRoute path="/posts/:id/edit" component={EditPostPage} isAuthorized={this.state.isAuthorized} />
              <ProtectedRoute path="/admin" render={(props) => <AdminPage user={this.state.user!} {...props} />} isAuthorized={this.state.isAuthorized} />
              <Route path="/login" render={(props) => <LoginPage {...props} onAuthenticated={this.onAuthenticated} isAuthorized={this.state.isAuthorized} />} />
              <Route path="/projects" component={ProjectsPage} />
              <Route path="/playground" component={PlaygroundPage} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
        <footer className="app-footer">
          <a href="https://github.com/xapphire13/xapphire13.com" target="_blank" className="github-link">
            <GitHub style={{ position: "relative", top: "5px", marginRight: "0.3em" }} />GitHub
          </a>
        </footer>
      </div>
    </UserContext.Provider>;
  }

  private onAuthenticated = async (user: User, token: string): Promise<void> => {
    this.setState({
      isAuthorized: true,
      user
    });
    await this.props.authManager.onSignedIn(user.username, token);
  }

  private onNavigate(): void {
    toast.dismiss();
  }
});
