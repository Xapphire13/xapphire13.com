import {readFile} from "fs";

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
    const file = await new Promise<string>((res, rej) => {
      readFile(this.configFilePath, {encoding: "utf8"}, (err, data) => err ? rej(err) : res(data));
    });

    this.configFile = JSON.parse(file);
  }
}
