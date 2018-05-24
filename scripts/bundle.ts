import {ROOT_PATH} from "./config";
import chalk from "chalk";
import fs from "fs-extra";
import globby from "globby";
import path from "path";
import process from "process";
import yazl from "yazl";

const CLIENT_PATH = path.join(ROOT_PATH, "packages/client");
const SERVER_PATH = path.join(ROOT_PATH, "packages/server");
const AZURE_INSTALL_SCRIPT = `
  cd server
  npm install --production --no-package-lock`;

async function bundle(outpath: string): Promise<void> {
  const distFiles = await globby([
    path.join(CLIENT_PATH, "dist/**"),
    path.join(SERVER_PATH, "dist/**")
  ]);

  const zipfile = new yazl.ZipFile();
  distFiles.forEach(filePath => {
    zipfile.addFile(filePath, filePath.replace(/.+?\/([^/]+)\/dist\//i, "$1/"));
  });

  zipfile.addFile(path.join(SERVER_PATH, "package.json"), "server/package.json");
  zipfile.addFile(path.join(SERVER_PATH, "web.config"), "web.config");
  zipfile.addBuffer(
    new Buffer(AZURE_INSTALL_SCRIPT, "utf8"),
    "install.ps1");

  return new Promise<void>(res => {
    zipfile.outputStream.pipe(fs.createWriteStream(outpath)).on("close", () => res());
    zipfile.end();
  });
}

const filename = process.argv[2] || "bundle.zip";
(async () => {
  process.stdout.write(`Generating ${filename}... `);
  await bundle(filename);
  console.log(chalk.green("Done!"));
})();
