import { injectable } from 'tsyringe';
import path from 'path';
import globby from 'globby';
import { APP_PATH } from '../constants';
import Resolver from './Resolver';

@injectable()
export default class ExperimentResolver implements Resolver {
  readonly Query = {
    async experiments() {
      const experiments = await globby([`${APP_PATH}/playground/*.js`]);

      return experiments.map(experiment => {
        return {
          name: path.basename(experiment).replace(/\.[^.]+$/, ''),
          description: 'TODO'
        };
      });
    }
  };
}
