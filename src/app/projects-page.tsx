import "./styles/projects-page.less";
import * as ClientApi from "./api/client-api";
import * as React from "react";
import {ScaleLoader} from "halogenium";

type State = {
  ownedRepos?: ClientApi.GithubRepo[];
  contributions?: ClientApi.GithubRepo[];
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
    ClientApi.getProjects().then(ownedRepos => this.setState({ownedRepos}));
    ClientApi.getContributions().then(contributions => this.setState({contributions}));

    // We don't want the loading indicator to flash on then off super quick
    // so we shall show the loading indicators for at least 500ms
    setTimeout(() => this.setState({showLoading: false}), 500);
  }

  public render(): JSX.Element {
    return <div className="projects-page">
      <div>
        <h2>Repositories</h2>
        {(this.state.ownedRepos && !this.state.showLoading) ?
          this.state.ownedRepos.map((repo, index) => <p key={index}>
            <a href={repo.html_url} target="_blank">{repo.name}</a>{repo.description && ` - ${repo.description}`}
          </p>) :
          <div className="halogenium-container">
            <ScaleLoader className="halogenium-loader" />
          </div>}
      </div>

      <div>
      <h2>Contributions</h2>
        {(this.state.contributions && !this.state.showLoading) ?
          this.state.contributions.map((repo, index) => <p key={index}>
            <a href={repo.html_url} target="_blank"><span style={{fontWeight: "bold"}}>{repo.owner.login}</span>/{repo.name}</a>{repo.description && ` - ${repo.description}`}
          </p>) :
          <div className="halogenium-container">
            <ScaleLoader className="halogenium-loader" />
          </div>}
      </div>
    </div>;
  }
}
