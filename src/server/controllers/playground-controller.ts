import fs from 'fs';
import util from 'util';
import path from 'path';
import { Get, JsonController, Param } from 'routing-controllers';
import boom from 'boom';
import { injectable } from 'tsyringe';
import globby from 'globby';
import { APP_PATH } from '../constants';
import Experiment from '../entities/experiment';

@injectable()
@JsonController('/api/playground')
export default class PlaygroundController {
  @Get('/experiments')
  // eslint-disable-next-line class-methods-use-this
  public async getExperiments(): Promise<Experiment[]> {
    const experiments = await globby([`${APP_PATH}/playground-*`]);

    return Promise.all(
      experiments.map(async experiment => {
        return {
          name: path.basename(experiment),
          description: 'TODO',
          main: 'TODO'
        };
      })
    );
  }

  @Get('/experiments/:id')
  // eslint-disable-next-line class-methods-use-this
  public async getExperiment(@Param('id') id: string): Promise<Experiment> {
    if (await util.promisify(fs.exists)(`${APP_PATH}/playground-${id}}`)) {
      return { name: id, description: 'TODO', main: 'TODO' };
    }
    throw boom.notFound(`Can't find experiment with id: ${id}`);
  }
}
