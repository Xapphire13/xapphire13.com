import "./styles/app.less";
import "react-github-button/assets/style.less";
import * as React from "react";
import {AppHeader} from "./app-header";
import {PostPreview} from "./post-preview";
import {NotFound} from "./not-found";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import MOCK_POSTS from "./mock-posts";
import GitHubButton = require("react-github-button");

const MAX_PREVIEW_LENGTH = 4000;

export class App extends React.Component {
  public render(): JSX.Element {
    return <BrowserRouter>
      <div className="app">
        <AppHeader />
        <div className="app-content-wrapper">
          <div className="app-content">
            <Switch>
              <Route exact path="/" render={() => MOCK_POSTS.map((post, i) =>
                <PostPreview
                  key={i}
                  title="Test"
                  created={new Date()}
                  lastModified={new Date()}
                  markdownText={post}
                  tags={["Test", "tech", "awesome"]}
                  maxLength={MAX_PREVIEW_LENGTH} />)} />
              <Route component={NotFound} />
            </Switch>
          </div>
        </div>
        <footer className="app-footer">
          <GitHubButton type="forks" size="large" namespace="xapphire13" repo="xapphire13.com" />
        </footer>
      </div>
    </BrowserRouter>;
  }
}
