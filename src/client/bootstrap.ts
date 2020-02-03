import 'reflect-metadata';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { container } from 'tsyringe';
import ready from 'document-ready';
import ApolloClient from 'apollo-boost';
import AuthManager from './auth-manager';
import App from './app';
import config from './constants/config';

ready(() => {
  const authManager = new AuthManager();
  container.registerInstance(AuthManager, authManager);

  const apolloClient = new ApolloClient({
    uri: config.GRAPH_ENDPOINT
  });

  const appRoot = document.createElement('div');
  appRoot.id = 'app-root';
  document.body.appendChild(appRoot);

  ReactDOM.render(
    React.createElement(
      BrowserRouter,
      {},
      React.createElement(App, { authManager, apolloClient })
    ),
    appRoot
  );
});
