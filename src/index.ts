import "reflect-metadata";
import "./error-handler";
import * as path from "path";
import * as sqlite from "sqlite";
import express = require("express");
import bodyParser = require("body-parser");
import {useExpressServer, useContainer} from "routing-controllers";
import {SqlUserRepository} from "./sql-user-repository";
import {Container} from "typedi";
import {SqlPostRepository} from "./sql-post-repository";
import * as jwt from "jsonwebtoken";

const APP_PATH = path.resolve(__dirname, "app");

async function main() {
  // Database
  const db = await sqlite.open(path.join(__dirname, "database.sqlite"), { promise: Promise });
  await db.migrate({
    migrationsPath: path.join(__dirname, "sql")
  });

  const app = express();

  // Config
  useContainer(Container);
  Container.set("PostRepository", new SqlPostRepository(db));
  app.set('port', process.env.PORT || 80);
  app.use(bodyParser.json());

  // Controllers
  const userRepository = new SqlUserRepository(db);
  useExpressServer(app, {
    controllers: [path.join(__dirname, "/*-controller.js")],
    defaultErrorHandler: false,
    authorizationChecker: async (action, _roles) => {
      const token = (() => {
        const matches = /Bearer (.*)/i.exec(action.request.get("Authorization") || "");
        return matches && matches[1];
      })();

      if (!token) {
        return false;
      }

      const {username} = (() => {
        const decodedToken = jwt.decode(token);

        if (!decodedToken) {
          throw new Error("Invalid token");
        }

        return decodedToken as {username: string, type: string};
      })();

      const user = await userRepository.getUser(username);

      return await new Promise<boolean>(res => jwt.verify(token, user.tokenSecret, (err: any) => res(!err)));
    }
  });

  // non-controller routes
  app.use("/app", express.static(APP_PATH));
  app.use((_req, res) => {
    if (!res.headersSent) {
      res.sendFile(path.join(APP_PATH, "index.html"));
    }
  });

  // Start!
  const server = app.listen(app.get("port"), () => {
    console.log("Listening on port " + server.address().port);
  });
}

main();
