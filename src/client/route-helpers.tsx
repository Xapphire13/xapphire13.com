import React from 'react';
import { Redirect, Route, RouteProps } from 'react-router-dom';

// tslint:disable-next-line variable-name
const ProtectedRoute = ({
  component: Component,
  render,
  isAuthorized,
  ...rest
}: RouteProps & { isAuthorized: boolean }) => (
  <Route
    {...rest}
    render={props => (
      <>
        {isAuthorized && render
          ? render(props)
          : Component && <Component {...props} />}
        {!isAuthorized && (
          <Redirect
            to={{
              pathname: '/login',
              state: { from: props.location }
            }}
          />
        )}
      </>
    )}
  />
);

export default ProtectedRoute;
