import "reflect-metadata";
import "./error-handler";
import * as path from "path";
import * as sqlite from "sqlite";
import * as jwt from "jsonwebtoken";
import express = require("express");
import bodyParser = require("body-parser");
import {useExpressServer, useContainer} from "routing-controllers";
import {Container} from "typedi";
import {UserRepository} from "./repositories/user-repository";
import {Logger} from "./logger";
import registerDependencies from "./production-registry";

const APP_PATH = path.resolve(__dirname, "app");

async function main() {
  // Database
  const db = await sqlite.open(path.resolve(__dirname, "../database.sqlite"), { promise: Promise });
  await db.migrate({
    migrationsPath: path.join(__dirname, "sql")
  });

  const app = express();

  // Config
  registerDependencies(db);
  useContainer(Container);
  app.set('port', process.env.PORT || 80);
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

      const user = await Container.get<UserRepository>("UserRepository").getUser(username);

      return await new Promise<boolean>(res => jwt.verify(token, user.tokenSecret, (err: any) => res(!err)));
    },
    currentUserChecker: async (action) => {
      const token = getToken(action.request.get("Authorization"));

      if(!token) {
        return null;
      }

      const {username} = jwt.decode(token) as any;
      return Container.get<UserRepository>("UserRepository").getUser(username);
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
    Container.get<Logger>("Logger").debug("Listening on port " + server.address().port);
  });
}

main();
