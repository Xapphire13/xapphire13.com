export class Config {

  constructor() { }

  public get githubToken(): string | undefined {
    return process.env.GITHUB_TOKEN;
  }

  public get mongoDbConnectionString(): string | undefined {
    return process.env.MONGODB_URI;
  }
}
