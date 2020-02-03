import './styles/app.less';
import 'react-toastify/dist/ReactToastify.css';
import React from 'react';
import {
  Route,
  RouteComponentProps,
  Switch,
  withRouter
} from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { GitHub } from 'react-feather';
import ApolloClient from 'apollo-boost';
import { ApolloProvider } from '@apollo/react-hooks';
import AdminPage from './admin-page';
import AppHeader from './app-header';
import AuthManager from './auth-manager';
import EditPostPage from './edit-post-page';
import HomePage from './home-page';
import LoginPage from './login-page';
import NotFound from './not-found';
import PlaygroundPage from './playground-page';
import PostView from './post-view';
import ProjectsPage from './projects-page';
import ProtectedRoute from './route-helpers';
import { User } from './models/user';
import UserContext from './user-context';

type Props = {
  authManager: AuthManager;
  apolloClient: ApolloClient<any>;
} & RouteComponentProps<any>;

type State = {
  user: User | null;
  isAuthorized: boolean;
  loading: boolean;
};

// tslint:disable-next-line variable-name
const App = withRouter(
  class App extends React.Component<Props, State> {
    constructor(props: Props) {
      super(props);

      this.state = {
        user: null,
        isAuthorized: false,
        loading: true
      };

      // Dismiss toast on navigate
      props.history.listen(() => toast.dismiss());
    }

    public componentDidMount(): void {
      const { authManager } = this.props;

      Promise.all([authManager.user, authManager.isAuthorized]).then(
        ([user, isAuthorized]) => {
          this.setState({
            user,
            isAuthorized: isAuthorized ?? false,
            loading: false
          });
        }
      );
    }

    private onAuthenticated = async (
      user: User,
      token: string
    ): Promise<void> => {
      const { authManager } = this.props;

      this.setState({
        isAuthorized: true,
        user
      });
      await authManager.onSignedIn(user.username, token);
    };

    public render(): JSX.Element {
      const { apolloClient } = this.props;
      const { loading, isAuthorized, user } = this.state;

      if (loading) {
        return <div />;
      }

      return (
        <ApolloProvider client={apolloClient}>
          <UserContext.Provider value={this.state}>
            <div id="app">
              <ToastContainer />
              <AppHeader />
              <div className="app-content-wrapper">
                <div className="app-content">
                  <Switch>
                    <Route
                      exact
                      path="/"
                      render={props => <HomePage {...props} />}
                    />
                    <ProtectedRoute
                      path="/posts/new"
                      component={EditPostPage}
                      isAuthorized={isAuthorized}
                    />
                    <Route exact path="/posts/:id" component={PostView} />
                    <ProtectedRoute
                      path="/posts/:id/edit"
                      component={EditPostPage}
                      isAuthorized={isAuthorized}
                    />
                    <ProtectedRoute
                      path="/admin"
                      render={props => <AdminPage user={user!} {...props} />}
                      isAuthorized={isAuthorized}
                    />
                    <Route
                      path="/login"
                      render={props => (
                        <LoginPage
                          {...props}
                          onAuthenticated={this.onAuthenticated}
                          isAuthorized={isAuthorized}
                        />
                      )}
                    />
                    <Route path="/projects" component={ProjectsPage} />
                    <Route path="/playground" component={PlaygroundPage} />
                    <Route component={NotFound} />
                  </Switch>
                </div>
              </div>
              <footer className="app-footer">
                <a
                  href="https://github.com/xapphire13/xapphire13.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  <GitHub
                    style={{
                      position: 'relative',
                      top: '5px',
                      marginRight: '0.3em'
                    }}
                  />
                  GitHub
                </a>
              </footer>
            </div>
          </UserContext.Provider>
        </ApolloProvider>
      );
    }
  }
);

export default App;
