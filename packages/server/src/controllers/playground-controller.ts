import {Get, JsonController, Param} from "routing-controllers";
import {PLAYGROUND_PATH} from "../constants";
import boom from "boom";
import {decorators} from "tsyringe";
import fs from "fs-extra";
import globby from "globby";
import Experiment = Xapphire13.Entities.Experiment;

const {injectable} = decorators;

@injectable()
@JsonController("/api/playground")
export class PlaygroundController {
  @Get("/experiments")
  public async getExperiments(): Promise<Experiment[]> {
    const experiments = await globby([`${PLAYGROUND_PATH}/*/package.json`]);

    return Promise.all(experiments.map(async experiment => {
      const {name, description, main} = await fs.readJSON(experiment);

      return {name, description, main};
    }));
  }

  @Get("/experiments/:id")
  public async getExperiment(@Param("id") id: string): Promise<Experiment> {
    try {
      const {name, description, main} = await fs.readJSON(`${PLAYGROUND_PATH}/${id}/package.json`);

      return {name, description, main};
    } catch {
      throw boom.notFound(`Can't find experiment with id: ${id}`);
    }
  }
}
