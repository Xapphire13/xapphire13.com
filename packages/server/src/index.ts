import "./error-handler";
import "reflect-metadata";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import * as sqlite from "sqlite";
import {APP_PATH, PLAYGROUND_PATH} from "./constants";
import {useContainer, useExpressServer} from "routing-controllers";
import {Config} from "./config";
import {Logger} from "./logger";
import {UserRepository} from "./repositories/user-repository";
import {container} from "tsyringe";
import registerDevelopmentDependencies from "./development-registry";
import registerProductionDependencies from "./production-registry";
import bodyParser = require("body-parser");
import express = require("express");

const IS_DEVELOPMENT = process.env.NODE_ENV !== "production";
const CONFIG_PATH = path.resolve(__dirname, "../config.json");

async function main(): Promise<void> {
  // Database
  const db = await sqlite.open(path.resolve(__dirname, "../database.sqlite"), {promise: Promise});
  await db.migrate({
    migrationsPath: path.join(__dirname, "sql")
  });
  await db.exec("PRAGMA foreign_keys = 1;");

  const app = express();

  // Config
  const config = new Config(CONFIG_PATH);
  await config.initialize();
  container.registerInstance("Config", config);
  if (!IS_DEVELOPMENT) {
    registerProductionDependencies(db);
  } else {
    registerDevelopmentDependencies(db);
  }
  useContainer({
    get: (token: any) => container.resolve(token)
  });
  app.set("port", process.env.PORT || 80);
  app.use(bodyParser.json());

  // Controllers
  const getToken = (authHeader: string = ""): string | null => {
    const matches = /Bearer (.*)/i.exec(authHeader);

    return matches && matches[1];
  };
  useExpressServer(app, {
    controllers: [path.join(__dirname, "controllers/*.js")],
    defaultErrorHandler: false,
    authorizationChecker: async (action, _roles) => {
      const token = getToken(action.request.get("Authorization"));

      if (!token) {
        return false;
      }

      const {username} = (() => {
        const decodedToken = jwt.decode(token) as any;

        if (!decodedToken || decodedToken.type !== "auth") {
          throw new Error("Invalid token");
        }

        return decodedToken;
      })();

      const user = await container.resolve<UserRepository>("UserRepository").getUser(username);

      return await new Promise<boolean>(res => jwt.verify(token, user.tokenSecret, (err: any) => res(!err)));
    },
    currentUserChecker: async (action) => {
      const token = getToken(action.request.get("Authorization"));

      if (!token) {
        return null;
      }

      const {username} = jwt.decode(token) as any;

      return container.resolve<UserRepository>("UserRepository").getUser(username);
    }
  });

  // non-controller routes
  app.use("/app", express.static(APP_PATH));
  app.use("/experiment", express.static(PLAYGROUND_PATH));
  app.use((_req, res) => {
    if (!res.headersSent) {
      res.sendFile(path.join(APP_PATH, "index.html"));
    }
  });

  // Start!
  const server = app.listen(app.get("port"), () => {
    container.resolve<Logger>("Logger").debug(`Listening on port ${server.address().port}`);
  });
}

main();
