import "./styles/message-bar.less";
import * as React from "react";

type Props = {
  type: "error" | "info";
  message: string;
};

export class MessageBar extends React.Component<Props> {
  public render(): JSX.Element {
    return <div className={this.getClassName()}>
      {this.props.message}
    </div>;
  }

  private getClassName(): string {
    const classes = ["message-bar"];
    classes.push(this.props.type);

    return classes.join(" ");
  }
}
