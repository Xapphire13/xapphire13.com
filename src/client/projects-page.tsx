import './styles/projects-page.less';
import React from 'react';
import { GitPullRequest, Star } from 'react-feather';
import { ScaleLoader } from 'halogenium';
import * as ClientApi from './api/client-api';

type State = {
  ownedRepos?: ClientApi.GithubRepo[];
  contributions?: ClientApi.RepoWithPrCount[];
  showLoading: boolean;
};

export default class ProjectsPage extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      showLoading: true
    };
  }

  public async componentDidMount(): Promise<void> {
    ClientApi.getProjects().then(ownedRepos =>
      this.setState({
        ownedRepos: ownedRepos.sort(
          (a, b) => b.stargazers_count - a.stargazers_count
        )
      })
    );
    ClientApi.getContributions().then(contributions =>
      this.setState({
        contributions: contributions.sort((a, b) => b.prCount - a.prCount)
      })
    );

    // We don't want the loading indicator to flash on then off super quick
    // so we shall show the loading indicators for at least 500ms
    setTimeout(() => this.setState({ showLoading: false }), 500);
  }

  public render(): JSX.Element {
    const { showLoading, ownedRepos, contributions } = this.state;

    return (
      <div className="projects-page">
        <div>
          <h2>
            Repositories
            {!showLoading && ownedRepos && ` (${ownedRepos.length})`}
          </h2>
          {ownedRepos && !showLoading ? (
            ownedRepos.map(repo => (
              <p key={repo.name}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {repo.name}
                </a>
                {repo.description && ` - ${repo.description}`}
                {' - '}
                {repo.stargazers_count}
                <Star className="icon" />
              </p>
            ))
          ) : (
            <div className="halogenium-container">
              <ScaleLoader className="halogenium-loader" />
            </div>
          )}
        </div>

        <div>
          <h2>
            Contributions
            {!showLoading &&
              contributions &&
              ` (${contributions.reduce(
                (agg, curr) => agg + curr.prCount,
                0
              )})`}
          </h2>
          {contributions && !showLoading ? (
            contributions.map(({ repo, prCount }) => (
              <p key={repo.name}>
                <a
                  href={repo.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span style={{ fontWeight: 'bold' }}>{repo.owner.login}</span>
                  /{repo.name}
                </a>
                {repo.description && ` - ${repo.description}`}
                {' - '}
                {prCount}
                <GitPullRequest className="icon" />
              </p>
            ))
          ) : (
            <div className="halogenium-container">
              <ScaleLoader className="halogenium-loader" />
            </div>
          )}
        </div>
      </div>
    );
  }
}
