import "./styles/playground-experiment-page.less";
import * as ClientApi from "./api/client-api";
import * as React from "react";
import * as path from "path";
import {Experiment} from "../models/experiment";
import {RouteComponentProps} from "react-router-dom";

type Props = RouteComponentProps<any>;

type State = {
  experimentInfo?: Experiment;
};

export class PlaygroundExperimentPage extends React.Component<Props, State> {
  private iframe: HTMLIFrameElement | null;
  private frameObserver: MutationObserver | null;

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public async componentDidMount(): Promise<void> {
    const experimentName = this.props.match.params["experiment"];
    this.setState({
      experimentInfo: await ClientApi.getExperiment(experimentName)
    });
  }

  public componentWillUnmount(): void {
    if (this.frameObserver) this.frameObserver.disconnect();
  }

  public render(): JSX.Element {
    return <div className="playground-experiment-page">
      {this.state.experimentInfo && <iframe
        ref={element => { if (!this.iframe) {this.iframe = element; this.setupFrame(); }}}
        src="about:blank"/>}
    </div>;
  }

  private setupFrame(): void {
    if (this.iframe) {
      this.frameObserver = new MutationObserver(() => this.resizeFrame());
      this.frameObserver.observe(this.iframe.contentDocument!, {childList: true, subtree: true});
      const script = this.iframe.contentDocument!.createElement("script");
      script.src = path.join("/experiment", this.state.experimentInfo!.name, this.state.experimentInfo!.main);
      this.iframe.contentDocument!.body.appendChild(script);
    }
  }

  private resizeFrame(): void {
    if (this.iframe) this.iframe.height = `${this.iframe.contentWindow!.document.body.scrollHeight}px`;
  }
}
