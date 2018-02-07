import "./styles/projects-page.less";
import * as React from "react";
import GitHub = require("@octokit/rest");

type State = {
  originalRepos: any[];
};

export class ProjectsPage extends React.Component<any, State> {
  private octokit = new GitHub();

  constructor(props: any) {
    super(props);

    this.state = {
      originalRepos: []
    };
  }

  public async componentDidMount(): Promise<void> {
    const {data: repos} = await this.octokit.repos.getForUser({username: "Xapphire13"});
    const originalRepos = (repos as any[]).filter(repo => !repo.fork);
    this.setState({originalRepos});
  }

  public render(): JSX.Element {
    return <div className="projects-page">
      {this.state.originalRepos.map((repo, index) => <div key={index}>
        <a href={repo.html_url} target="_blank">{repo.name}</a>
      </div>)}
    </div>;
  }
}
