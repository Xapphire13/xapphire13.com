import * as moment from "moment";
import {Get, JsonController} from "routing-controllers";
import {Config} from "../config";
import {Inject} from "typedi";
import fetch from "node-fetch";
import GitHub = require("@octokit/rest");

const CACHE_LIFETIME = moment.duration(1, "h");

type CachedValue<T = any> = [T, moment.Moment];

@JsonController("/api/github")
export class GitHubController {
  private github = new GitHub();
  private ownedRepos: CachedValue<any[]> = [[], moment(0)];
  private contributionRepos: CachedValue<any[]> = [[], moment(0)];

  constructor(@Inject("Config") private config: Config) {
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
      const ownedRepos = (await this.loadAll(() => this.github.repos.getAll({type: "owner"}), data => data))
        .filter(repo => !repo.fork && !repo.private);
      this.ownedRepos = [
        ownedRepos,
        moment()
      ];

      return ownedRepos;
    }

    return this.ownedRepos[0];
  }

  @Get("/contributions")
  public async getContributions(): Promise<any[]> {
    if (moment().diff(this.contributionRepos[1]) > CACHE_LIFETIME.asMilliseconds()) {
      const contributionRepos: any[] = [];

      if (this.config.githubToken) {
        const pullRequests = await this.loadAll(() => this.github.search.issues({q: "is:pr author:Xapphire13 archived:false is:merged"}), data => data.items);

        for (const pr of pullRequests) {
          const repo = await fetch(pr.repository_url, {
            headers: {
              Authorization: `token ${this.config.githubToken}`,
              "Content-Type": "application/json"
            }
          }).then(res => res.json());

          if (repo.owner.login.toLowerCase() !== "xapphire13" && !contributionRepos.some(r => r.name === repo.name)) {
            contributionRepos.push(repo);
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

  private async loadAll(method: () => Promise<GitHub.AnyResponse>, accessor: (data: any) => any[]): Promise<any[]> {
    const results = [];
    let response = await method();
    results.push(...accessor(response.data));
    while (this.github.hasNextPage(response)) {
      response = await this.github.getNextPage(response);
      results.push(...accessor(response.data));
    }

    return results;
  }
}
