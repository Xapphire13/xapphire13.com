import fs from "fs";
import util from "util";

type ConfigFile = {
  githubToken?: string;
};

export class Config {
  private configFile: ConfigFile;

  constructor(private configFilePath: string) { }

  public get githubToken(): string | undefined {
    return this.configFile.githubToken;
  }

  public async initialize(): Promise<void> {
    try {
      this.configFile = JSON.parse(await util.promisify(fs.readFile)(this.configFilePath, { encoding: "utf8" }));
    } catch {
      this.configFile = {};
    }
  }
}
