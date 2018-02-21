import * as React from "react";
import * as ReactDOM from "react-dom";
import {App} from "./app";
import {AuthManager} from "./auth-manager";
import {BrowserRouter} from "react-router-dom";
import {container} from "tsyringe";
import ready = require("document-ready");

ready(() => {
  const authManager = new AuthManager();
  container.registerInstance(AuthManager, authManager);

  const appRoot = document.createElement("div");
  appRoot.id = "app-root";
  document.body.appendChild(appRoot);

  ReactDOM.render(React.createElement(BrowserRouter, {}, React.createElement(App, {authManager})), appRoot);
});
