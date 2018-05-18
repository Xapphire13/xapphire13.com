import {ROOT_PATH} from "./config";
import fs from "fs-extra";
import globby from "globby";
import path from "path";
import process from "process";
import yazl from "yazl";

// TODO
function bundle(outpath: string): void {
  const distFiles = globby.sync(path.join("TODO", "**"));
  const zipfile = new yazl.ZipFile();

  distFiles.forEach(file => {
    zipfile.addFile(file, path.relative(ROOT_PATH, file));
  });

  zipfile.addFile("./package.json", "package.json");
  zipfile.addFile("./web.config", "web.config");

  zipfile.outputStream.pipe(fs.createWriteStream(outpath)).on("close", () => console.log("Generated bundle"));
  zipfile.end();
}

const filename = process.argv[2] || "bundle.zip";
bundle(filename);
