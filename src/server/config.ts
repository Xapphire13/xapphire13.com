export class Config {

  constructor() { }

  public get githubToken(): string | undefined {
    return process.env["GITHUB_TOKEN"];
  }
}
