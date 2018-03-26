const fs = require("fs-extra");
const globby = require("globby");
const process = require("process");
const path = require("path");
const yazl = require("yazl");
const {DIST_PATH, ROOT_PATH} = require("./config");

function bundle (outpath) {
  const distFiles = globby.sync(path.join(DIST_PATH, "**"));
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
