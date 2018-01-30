import * as React from "react";
import {Redirect, Route, RouteProps} from "react-router-dom";

export const ProtectedRoute = ({component: Component, render, isAuthorized, ...rest}: RouteProps & {isAuthorized: boolean}) => <Route
  {...rest}
  render={(props) =>
    isAuthorized ?
      (render ? render(props) : Component && <Component {...props} />) :
      <Redirect to={{
        pathname: "/login",
        state: { from: props.location }
      }} />
  }
/>
