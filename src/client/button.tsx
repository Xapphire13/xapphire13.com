import "./styles/button.less";
import * as React from "react";

type Props = {
  text: string;
  icon?: (props: React.HTMLAttributes<any>) => JSX.Element
  onClick?: () => void;
};

export class Button extends React.Component<Props> {
  public render(): JSX.Element {
    return <button className="button" onClick={this.props.onClick}>
      {this.props.icon && this.props.icon({className: "button-icon"})}
      <span className="button-text">{this.props.text}</span>
    </button>;
  }
}
