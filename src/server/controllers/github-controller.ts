import { Get, JsonController } from "routing-controllers";
import { Config } from "../config";
import GitHub from "@octokit/rest";
import { inject, singleton } from "tsyringe";
import fetch from "node-fetch";
import moment from "moment";

const CACHE_LIFETIME = moment.duration(1, "h");

type CachedValue<T = any> = [T, moment.Moment];
type RepoWithPrCount = { repo: any, prCount: number };

@singleton()
@JsonController("/api/github")
export class GitHubController {
  private github = new GitHub();
  private ownedRepos: CachedValue<any[]> = [[], moment(0)];
  private contributionRepos: CachedValue<RepoWithPrCount[]> = [[], moment(0)];

  constructor(@inject("Config") private config: Config) {
    if (config.githubToken) {
      this.github.authenticate({
        type: "token",
        token: config.githubToken
      });
    }
  }

  @Get("/projects")
  public async getProjects(): Promise<any[]> {
    if (moment().diff(this.ownedRepos[1]) > CACHE_LIFETIME.asMilliseconds()) {
      const ownedRepos = (await this.github.repos.list({ type: "owner" })).data
        .filter((repo: any) => !repo.fork && !repo.private);
      this.ownedRepos = [
        ownedRepos,
        moment()
      ];

      return ownedRepos;
    }

    return this.ownedRepos[0];
  }

  @Get("/contributions")
  public async getContributions(): Promise<RepoWithPrCount[]> {
    if (moment().diff(this.contributionRepos[1]) > CACHE_LIFETIME.asMilliseconds()) {
      const contributionRepos: RepoWithPrCount[] = [];

      if (this.config.githubToken) {
        const pullRequests = (await this.github.search.issues({ q: "is:pr author:Xapphire13 archived:false is:merged" })).data.items;
        const repositories: { [url: string]: number } = {};
        pullRequests.forEach((pr: any) => {
          repositories[pr.repository_url] = ~~repositories[pr.repository_url] + 1;
        });

        for (const repoUrl of Object.keys(repositories)) {
          const repo = await fetch(repoUrl, {
            headers: {
              Authorization: `token ${this.config.githubToken}`,
              "Content-Type": "application/json"
            }
          }).then(res => res.json());

          if (repo.owner.login.toLowerCase() !== "xapphire13") {
            contributionRepos.push({
              repo,
              prCount: repositories[repoUrl]
            });
          }
        }
      }
      this.contributionRepos = [
        contributionRepos,
        moment()
      ];

      return contributionRepos;
    }

    return this.contributionRepos[0];
  }

  // TODO use updated paginated response
  // private async loadAll(method: () => Promise<GitHub.AnyResponse>, accessor: (data: any) => any[]): Promise<any[]> {
  //   const results = [];
  //   let response = await method();
  //   results.push(...accessor(response.data));
  //   while (this.github.hasNextPage(response as any)) {
  //     response = await this.github.getNextPage(response as any);
  //     results.push(...accessor(response.data));
  //   }

  //   return results;
  // }
}
