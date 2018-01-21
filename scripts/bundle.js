const fs = require("fs");
const globby = require("globby");
const path = require("path");
const yazl = require("yazl");
const {DIST_PATH, ROOT_PATH} = require("./config");

module.exports = function(outpath) {
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
