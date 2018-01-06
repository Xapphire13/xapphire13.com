import "./styles/app.less";
import "react-github-button/assets/style.less";
import * as React from "react";
import {AppHeader} from "./app-header";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {HomePage} from "./home-page";
import {NotFound} from "./not-found";
import GitHubButton = require("react-github-button");

export class App extends React.Component {
  public render(): JSX.Element {
    return <BrowserRouter>
      <div className="app">
        <AppHeader />
        <div className="app-content-wrapper">
          <div className="app-content">
            <Switch>
              <Route exact path="/" component={HomePage} />
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
