import express = require("express");
import bodyParser = require("body-parser");
import * as boom from "boom";
import * as path from "path";
import * as sqlite from "sqlite";
import {SqlPostRepository} from "./sql-post-repository";
import {SqlUserRepository} from "./sql-user-repository";
import {PostController} from "./post-controller";
import {AuthController} from "./auth-controller";

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
  const userRepository = new SqlUserRepository(db);
  new PostController(app, new SqlPostRepository(db), userRepository).registerRoutes();
  new AuthController(app, userRepository).registerRoutes();

  // Routes
  app.use("/app", express.static(APP_PATH));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(APP_PATH, "index.html"));
  });

  // Error handler
  app.use(<express.ErrorRequestHandler>((err, _req, res, _next) => {
    const boomError: boom.Boom = boom.isBoom(err) ? err : boom.badImplementation(err);

    if(boomError.isServer) {
      console.error(boomError.message);
    }

    return res.status(boomError.output.statusCode).json(boomError.output.payload);
  }));

  // Start!
  const server = app.listen(app.get("port"), () => {
    console.log("Listening on port " + server.address().port);
  });
}

main();
