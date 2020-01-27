import childProcess from "child_process";
import yargs from "yargs";

const args = yargs
  .options({
    debug: {
      describe: "Run in debug mode",
      type: "boolean",
      default: false
    } as yargs.Options
  })
  .strict().argv;

(async function run() {
  const tsc = childProcess.spawn("./node_modules/.bin/tsc", [
    "--watch",
    "-p",
    "./src/server"
  ]);
  const webpack = childProcess.spawn("./node_modules/.bin/webpack", [
    "--watch",
    "--config",
    "./webpack.dev.js"
  ]);

  const serverCompile = new Promise(resolve => {
    tsc.stdout.on("data", data => {
      const str = String(data).trim();

      if (str) {
        if (/Watching for file changes/.test(str)) {
          resolve();
        }

        str.split("\n").forEach(line => console.log(`[TSC] ${line}`));
      }
    });
  });

  const webpackCompile = new Promise(resolve => {
    webpack.stdout.on("data", data => {
      const str = String(data).trim();

      if (str) {
        if (/Built at:/.test(str)) {
          resolve();
        }

        str.split("\n").forEach(line => console.log(`[WEBPACK] ${line}`));
      }
    });
  });

  await Promise.all([serverCompile, webpackCompile]);

  const nodemonArgs = ["--watch", "./dist", "--ignore", "./dist/app"];

  if (args.debug) {
    nodemonArgs.push("--inspect");
  }

  const nodemon = childProcess.spawn("./node_modules/.bin/nodemon", [
    ...nodemonArgs,
    "--exec",
    "heroku local",
    "--signal",
    "SIGTERM"
  ]);

  nodemon.stdout.on("data", data => {
    const str = String(data).trim();

    if (str) {
      str.split("\n").forEach(line => console.log(`[NODEMON] ${line}`));
    }
  });
})();
