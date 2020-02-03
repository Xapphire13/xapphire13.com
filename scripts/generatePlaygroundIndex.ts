import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import notNull from '../src/shared/utils/notNull';

(async () => {
  const PLAYGROUND_PATH = path.join(__dirname, '../src/playground');
  const OUTPUT_PATH = path.join(__dirname, '../dist/app/playground/index.json');

  const playgroundDirs = fs.readdirSync(PLAYGROUND_PATH);
  const playgroundApps = (
    await Promise.all(
      playgroundDirs.map(async dir => {
        try {
          const projectFile = await promisify(fs.readFile)(
            path.join(PLAYGROUND_PATH, dir, 'project.json'),
            'utf8'
          );

          const project = JSON.parse(projectFile) as {
            name: string;
            description: string;
          };

          return {
            ...project,
            project: dir
          };
        } catch (err) {
          return null;
        }
      })
    )
  )
    .filter(notNull)
    .reduce<Record<string, any>>((res, { description, name, project }) => {
      res[project] = {
        description,
        name
      };

      return res;
    }, {});

  await promisify(fs.writeFile)(OUTPUT_PATH, JSON.stringify(playgroundApps));
})();
