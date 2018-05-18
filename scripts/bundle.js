"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const config_1 = require("./config");
const fs_extra_1 = __importDefault(require("fs-extra"));
const globby_1 = __importDefault(require("globby"));
const path_1 = __importDefault(require("path"));
const process_1 = __importDefault(require("process"));
const yazl_1 = __importDefault(require("yazl"));
function bundle(outpath) {
    const distFiles = globby_1.default.sync(path_1.default.join("TODO", "**"));
    const zipfile = new yazl_1.default.ZipFile();
    distFiles.forEach(file => {
        zipfile.addFile(file, path_1.default.relative(config_1.ROOT_PATH, file));
    });
    zipfile.addFile("./package.json", "package.json");
    zipfile.addFile("./web.config", "web.config");
    zipfile.outputStream.pipe(fs_extra_1.default.createWriteStream(outpath)).on("close", () => console.log("Generated bundle"));
    zipfile.end();
}
const filename = process_1.default.argv[2] || "bundle.zip";
bundle(filename);
//# sourceMappingURL=bundle.js.map