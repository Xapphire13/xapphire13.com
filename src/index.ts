import * as express from "express";
import * as path from "path";
import * as sqlite from "sqlite";
import {PostController} from "./post-controller";

const APP_PATH = path.resolve(__dirname, "app");

async function main() {
  const app = express();

  app.set('port', process.env.PORT || 80);

  // Controllers
  new PostController(app).registerRoutes();

  // Routes
  app.use("/app", express.static(APP_PATH));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(APP_PATH, "index.html"));
  });

  // Database
  const db = await sqlite.open(path.join(__dirname, "database.sqlite"), { promise: Promise });
  await db.migrate({
    migrationsPath: path.join(__dirname, "sql")
  });

  console.log(await db.all("SELECT * FROM Post"));

  const server = app.listen(app.get("port"), () => {
    console.log("Listening on port " + server.address().port);
  });
}

main();
