import {ROOT_PATH, WWWROOT_PATH} from "./config";
import chalk from "chalk";
import child_process from "child_process";
import fs from "fs-extra";
import globby from "globby";
import path from "path";
import rimraf from "rimraf";

const CLIENT_PATH = path.join(ROOT_PATH, "packages/client");
const SERVER_PATH = path.join(ROOT_PATH, "packages/server");
const ENTITIES_PATH = path.join(ROOT_PATH, "packages/entities");

async function deploy(): Promise<void> {
  await Promise.all(
    (await globby(["*", "!config.json", "!database.sqlite"], {cwd: WWWROOT_PATH})).map(toDelete =>
      new Promise((res, rej) => rimraf(toDelete, (err) => !err ? res() : rej(err)))));

  const distFiles = await globby([
    path.join(CLIENT_PATH, "dist/**"),
    path.join(SERVER_PATH, "dist/**")
  ]);

  await Promise.all(distFiles.map(
    filePath => fs.copy(
      filePath,
      filePath.replace(/.+?\/([^/]+)\/dist\//i, `${WWWROOT_PATH}/$1/`),
      {overwrite: true})));

  await fs.copy(ENTITIES_PATH, path.join(WWWROOT_PATH, "entities"), {overwrite: true, recursive: true});
  await fs.copy(path.join(SERVER_PATH, "package.json"), path.join(WWWROOT_PATH, "server/package.json"), {overwrite: true});
  await fs.copy(path.join(SERVER_PATH, "web.config"), path.join(WWWROOT_PATH, "web.config"), {overwrite: true});
  child_process.execSync("yarn install --prod", {cwd: path.join(WWWROOT_PATH, "server")});
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
