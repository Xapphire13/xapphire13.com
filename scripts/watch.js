const child_process = require("child_process");
const process = require("process");
const path = require("path");
const {ROOT_PATH} = require("./config");

const server = child_process.spawn("npm", ["start"], {
  stdio: "inherit",
  cwd: ROOT_PATH,
  shell: true
});
const app = child_process.spawn(
  "webpack",
  [
    "-w",
    "--config",
    "webpack.dev.js"
  ], {
  stdio: "inherit",
  cwd: ROOT_PATH,
  shell: true
});

process.on("SIGINT", () => {
  server.kill();
  app.kill();
});
