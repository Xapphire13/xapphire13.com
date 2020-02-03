import { injectable } from 'tsyringe';
import path from 'path';
import fs from 'fs';
import { promisify } from 'util';
import { APP_PATH } from '../constants';
import Resolver from './Resolver';

@injectable()
export default class ExperimentResolver implements Resolver {
  readonly Query = {
    async experiments() {
      const experiments: Record<
        string,
        { name: string; description: string }
      > = JSON.parse(
        await promisify(fs.readFile)(
          path.join(APP_PATH, 'playground/index.json'),
          'utf8'
        )
      );

      return Object.keys(experiments).map(path => ({
        ...experiments[path],
        path
      }));
    }
  };
}
