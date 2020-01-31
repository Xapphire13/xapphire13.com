import './styles/playground-page.less';
import React from 'react';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ScaleLoader } from 'halogenium';
import delay from 'delay';
import PlaygroundExperimentPage from './playground-experiment-page';
import * as ClientApi from './api/client-api';
import Experiment from ':entities/experiment';

type Props = RouteComponentProps<any>;
type State = {
  experiments: Experiment[];
  loading: boolean;
};

export default class PlaygroundPage extends React.Component<Props, State> {
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

        this.setState({ experiments });
      })()
    ]);

    this.setState({ loading: false });
  }

  public render(): JSX.Element {
    const { match } = this.props;
    const { experiments, loading } = this.state;

    return (
      <Switch>
        <Route
          exact
          path={`${match.path}/:experiment`}
          component={PlaygroundExperimentPage}
        />
        <Route
          render={() => (
            <div className="playground-page">
              {!loading ? (
                experiments.map(experiment => (
                  <div key={experiment.name}>
                    <Link to={`/playground/${experiment.name}`}>
                      {experiment.name}
                    </Link>{' '}
                    - {experiment.description}
                  </div>
                ))
              ) : (
                <div className="halogenium-container">
                  <ScaleLoader className="halogenium-loader" />
                </div>
              )}
            </div>
          )}
        />
      </Switch>
    );
  }
}
