import "./styles/projects-page.less";
import * as ClientApi from "./api/client-api";
import * as React from "react";
import {GitPullRequest, Star} from "react-feather";
import {ScaleLoader} from "halogenium";

type State = {
  ownedRepos?: ClientApi.GithubRepo[];
  contributions?: ClientApi.RepoWithPrCount[];
  showLoading: boolean;
};

export class ProjectsPage extends React.Component<any, State> {
  constructor(props: any) {
    super(props);

    this.state = {
      showLoading: true
    };
  }

  public async componentDidMount(): Promise<void> {
    ClientApi.getProjects().then(ownedRepos => this.setState({ownedRepos: ownedRepos.sort((a, b) => b.stargazers_count - a.stargazers_count)}));
    ClientApi.getContributions().then(contributions => this.setState({contributions: contributions.sort((a, b) => b.prCount - a.prCount)}));

    // We don't want the loading indicator to flash on then off super quick
    // so we shall show the loading indicators for at least 500ms
    setTimeout(() => this.setState({showLoading: false}), 500);
  }

  public render(): JSX.Element {
    return <div className="projects-page">
      <div>
        <h2>Repositories{!this.state.showLoading && this.state.ownedRepos && ` (${this.state.ownedRepos.length})`}</h2>
        {(this.state.ownedRepos && !this.state.showLoading) ?
          this.state.ownedRepos.map((repo, index) => <p key={index}>
            <a href={repo.html_url} target="_blank">{repo.name}</a>
            {repo.description && ` - ${repo.description}`}
            {" - "}{repo.stargazers_count}<Star className="icon" />
          </p>) :
          <div className="halogenium-container">
            <ScaleLoader className="halogenium-loader" />
          </div>}
      </div>

      <div>
      <h2>Contributions{!this.state.showLoading && this.state.contributions && ` (${this.state.contributions.reduce((agg, curr) => agg + curr.prCount, 0)})`}</h2>
        {(this.state.contributions && !this.state.showLoading) ?
          this.state.contributions.map(({repo, prCount}, index) => <p key={index}>
            <a href={repo.html_url} target="_blank">
              <span style={{fontWeight: "bold"}}>{repo.owner.login}</span>/{repo.name}
            </a>
            {repo.description && ` - ${repo.description}`}
            {" - "}{prCount}<GitPullRequest className="icon" />
          </p>) :
          <div className="halogenium-container">
            <ScaleLoader className="halogenium-loader" />
          </div>}
      </div>
    </div>;
  }
}
