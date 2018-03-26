import * as fs from "fs-extra";

type ConfigFile = {
  githubToken?: string;
};

export class Config {
  private configFile: ConfigFile;

  constructor(private configFilePath: string) {}

  public get githubToken(): string | undefined {
    return this.configFile.githubToken;
  }

  public async initialize(): Promise<void> {
    this.configFile = await fs.readJSON(this.configFilePath, {encoding: "utf8"});
  }
}
