import * as React from "react";
import * as ReactDOM from "react-dom";
import ready = require("document-ready");
import {BrowserRouter} from "react-router-dom";
import {App} from "./app";

ready(() => {
  const appRoot = document.createElement("div");
  appRoot.id = "app-root"
  document.body.appendChild(appRoot);

  ReactDOM.render(React.createElement(BrowserRouter, {}, React.createElement(App)), appRoot);
});
