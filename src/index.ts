import express = require("express");
import bodyParser = require("body-parser");
import * as path from "path";
import * as sqlite from "sqlite";
import {SqlPostRepository} from "./post-repository-sql";
import {PostController} from "./post-controller";

const APP_PATH = path.resolve(__dirname, "app");

async function main() {
  // Database
  const db = await sqlite.open(path.join(__dirname, "database.sqlite"), { promise: Promise });
  await db.migrate({
    migrationsPath: path.join(__dirname, "sql")
  });

  const app = express();

  // Config
  app.set('port', process.env.PORT || 80);
  app.use(bodyParser.json());

  // Controllers
  new PostController(app, new SqlPostRepository(db)).registerRoutes();

  // Routes
  app.use("/app", express.static(APP_PATH));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(APP_PATH, "index.html"));
  });

  // Start!
  const server = app.listen(app.get("port"), () => {
    console.log("Listening on port " + server.address().port);
  });
}

main();
