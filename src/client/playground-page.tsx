import './styles/playground-page.less';
import React, { useState, useEffect } from 'react';
import { Link, Route, RouteComponentProps, Switch } from 'react-router-dom';
import { ScaleLoader } from 'halogenium';
import delay from 'delay';
import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import PlaygroundExperimentPage from './playground-experiment-page';
import { LoadExperiments } from '../__generated__/graphql';
import notNull from '../shared/utils/notNull';

const EXPERIMENTS_QUERY = gql`
  query LoadExperiments {
    experiments {
      name
      description
    }
  }
`;

type Props = RouteComponentProps;

export default function PlaygroundPage({ match }: Props) {
  const { data, loading: experimentsLoading } = useQuery<LoadExperiments>(
    EXPERIMENTS_QUERY
  );
  const [delayFinished, setDelayFinished] = useState(false);
  const loading = experimentsLoading || !delayFinished;
  const experiments = data?.experiments?.filter(notNull) ?? [];

  useEffect(() => {
    // Synthetic delay to prevent loading indicator flashing
    delay(500).then(() => {
      setDelayFinished(true);
    });
  }, []);

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
            {!loading && (
              <>
                {experiments.map(experiment => (
                  <div key={experiment.name ?? ''}>
                    <Link to={`/playground/${experiment.name}`}>
                      {experiment.name}
                    </Link>{' '}
                    - {experiment.description}
                  </div>
                ))}
              </>
            )}
            {loading && (
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
