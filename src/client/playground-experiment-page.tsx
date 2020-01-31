import './styles/playground-experiment-page.less';
import React from 'react';
import path from 'path';
import { RouteComponentProps } from 'react-router-dom';
import * as ClientApi from './api/client-api';
import Experiment from ':entities/experiment';

type Props = RouteComponentProps<any>;

type State = {
  experimentInfo?: Experiment;
};

export default class PlaygroundExperimentPage extends React.Component<
  Props,
  State
> {
  private iframe: HTMLIFrameElement | null;

  private frameObserver: MutationObserver | null;

  constructor(props: Props) {
    super(props);

    this.state = {};
  }

  public async componentDidMount(): Promise<void> {
    const { match } = this.props;

    const experimentName = match.params.experiment;
    this.setState({
      experimentInfo: await ClientApi.getExperiment(experimentName)
    });
  }

  public componentWillUnmount(): void {
    if (this.frameObserver) this.frameObserver.disconnect();
  }

  private setupFrame(): void {
    const { experimentInfo } = this.state;

    if (this.iframe) {
      this.frameObserver = new MutationObserver(() => this.resizeFrame());
      this.frameObserver.observe(this.iframe.contentDocument!, {
        childList: true,
        subtree: true
      });
      const script = this.iframe.contentDocument!.createElement('script');
      script.src = path.join(
        '/experiment',
        experimentInfo!.name,
        experimentInfo!.main
      );
      this.iframe.contentDocument!.body.appendChild(script);
    }
  }

  private resizeFrame(): void {
    if (this.iframe)
      this.iframe.height = `${
        this.iframe.contentWindow!.document.body.scrollHeight
      }px`;
  }

  public render(): JSX.Element {
    const { experimentInfo } = this.state;

    return (
      <div className="playground-experiment-page">
        {experimentInfo && (
          <iframe
            title="experiment-frame"
            ref={element => {
              if (!this.iframe) {
                this.iframe = element;
                this.setupFrame();
              }
            }}
            src="about:blank"
          />
        )}
      </div>
    );
  }
}
