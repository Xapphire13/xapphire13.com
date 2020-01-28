import './styles/not-found.less';
import * as React from 'react';

type Props = {
  message?: string;
};

export class NotFound extends React.Component<Props> {
  public render(): JSX.Element {
    return (
      <div className="not-found">
        <h1>
          {this.props.message || "404: This is not the page you're looking for"}
        </h1>
           </div>;
  }
}
