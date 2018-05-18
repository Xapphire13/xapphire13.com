import "./styles/playground-page.less";
import * as ClientApi from "./api/client-api";
import * as React from "react";
import {Link, Route, RouteComponentProps, Switch} from "react-router-dom";
import {Experiment} from "xapphire13-entities";
import {PlaygroundExperimentPage} from "./playground-experiment-page";
import {ScaleLoader} from "halogenium";
import delay from "delay";

type Props = RouteComponentProps<any>;
type State = {
  experiments: Experiment[];
  loading: boolean;
};

export class PlaygroundPage extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      experiments: [],
      loading: true
    };
  }

  public async componentDidMount(): Promise<void> {
    await Promise.all([
      delay(500), // Synthetic delay to prevent loading indicator flashing
      (async () => {
        const experiments = await ClientApi.getExperiments();

        this.setState({experiments});
      })()
    ]);

    this.setState({loading: false});
  }

  public render(): JSX.Element {
    return <Switch>
      <Route exact path={`${this.props.match.path}/:experiment`} component={PlaygroundExperimentPage} />
      <Route render={() => <div className="playground-page">
          {!this.state.loading ? this.state.experiments.map((experiment, index) =>
            <div key={index}>
              <Link to={`/playground/${experiment.name}`}>{experiment.name}</Link> - {experiment.description}
            </div>
          ) :
            <div className="halogenium-container">
              <ScaleLoader className="halogenium-loader" />
            </div>
          }
        </div>
      }/>
    </Switch>;
  }
}
