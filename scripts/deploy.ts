import { ROOT_PATH, WWWROOT_PATH } from "./config";
import chalk from "chalk";
import child_process from "child_process";
import globby from "globby";
import path from "path";
import rimraf from "rimraf";
import fs from "fs";
import util from "util";

const CLIENT_PATH = path.join(ROOT_PATH, "src/client");
const SERVER_PATH = path.join(ROOT_PATH, "src/server");

const copyFileAsync = util.promisify(fs.copyFile);

async function deploy(): Promise<void> {
  await Promise.all(
    (await globby(["*", "!config.json", "!database.sqlite"], {
      cwd: WWWROOT_PATH
    })).map(
      toDelete =>
        new Promise((res, rej) =>
          rimraf(toDelete, err => (!err ? res() : rej(err)))
        )
    )
  );

  const distFiles = await globby([
    path.join(CLIENT_PATH, "dist/**"),
    path.join(SERVER_PATH, "dist/**")
  ]);

  await Promise.all(
    distFiles.map(filePath =>
      copyFileAsync(
        filePath,
        filePath.replace(/.+?\/([^/]+)\/dist\//i, `${WWWROOT_PATH}/$1/`)
      )
    )
  );

  await copyFileAsync(
    path.join(SERVER_PATH, "package.json"),
    path.join(WWWROOT_PATH, "server/package.json")
  );
  await copyFileAsync(
    path.join(SERVER_PATH, "web.config"),
    path.join(WWWROOT_PATH, "web.config")
  );
  child_process.execSync("yarn install --prod", {
    cwd: path.join(WWWROOT_PATH, "server")
  });
}

(async () => {
  console.log("Deploying...");

  try {
    await deploy();
    console.log(chalk.green("Success!"));
  } catch (ex) {
    console.error(chalk.red(`Failure: ${ex}`));
    throw ex;
  }
})();
