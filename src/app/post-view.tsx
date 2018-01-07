import * as React from "react";
import {RouteComponentProps} from "react-router-dom";

type Params = {
  id: string;
};

export class PostView extends React.Component<RouteComponentProps<Params>> {
  public render(): JSX.Element {
    return <div className="post-view">
      {this.props.match.params.id}
    </div>;
  }
}
