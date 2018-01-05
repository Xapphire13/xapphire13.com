import "./styles/not-found.less";
import * as React from "react";

export class NotFound extends React.Component {
  public render(): JSX.Element {
    return <div className="not-found">
      <h1>404: This is not the page you're looking for</h1>
    </div>
  }
}
