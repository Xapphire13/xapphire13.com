import fs from "fs";
import util from "util";
import { Get, JsonController, Param } from "routing-controllers";
import { PLAYGROUND_PATH } from "../constants";
import boom from "boom";
import { injectable } from "tsyringe";
import globby from "globby";
import Experiment from "../entities/experiment";

async function readJSON(path: string) {
  return JSON.parse(await util.promisify(fs.readFile)(path, { encoding: "utf8" }));
}

@injectable()
@JsonController("/api/playground")
export class PlaygroundController {
  @Get("/experiments")
  public async getExperiments(): Promise<Experiment[]> {
    const experiments = await globby([`${PLAYGROUND_PATH}/*/package.json`]);

    return Promise.all(experiments.map(async experiment => {
      const { name, description, main } = await readJSON(experiment);

      return { name, description, main };
    }));
  }

  @Get("/experiments/:id")
  public async getExperiment(@Param("id") id: string): Promise<Experiment> {
    try {
      const { name, description, main } = await readJSON(`${PLAYGROUND_PATH}/${id}/package.json`);

      return { name, description, main };
    } catch {
      throw boom.notFound(`Can't find experiment with id: ${id}`);
    }
  }
}
