import "reflect-metadata";
import "./error-handler";
import * as jwt from "jsonwebtoken";
import * as path from "path";
import { APP_PATH } from "./constants";
import { useContainer, useExpressServer } from "routing-controllers";
import { Config } from "./config";
import { Logger } from "./logger";
import { UserRepository } from "./repositories/UserRepository";
import { container } from "tsyringe";
import registerDependencies from "./registerDependencies";
import bodyParser = require("body-parser");
import express = require("express");
import { MongoClient } from "mongodb";


async function main(): Promise<void> {
  // Config
  const config = new Config();

  if (config.mongoDbConnectionString == null) {
    throw new Error("Can't get mongo connection URI");
  }
  const mongoDb = new MongoClient(config.mongoDbConnectionString, { useUnifiedTopology: true });
  await mongoDb.connect();

  container.registerInstance("Config", config);
  registerDependencies(mongoDb);
  useContainer({
    get: (token: any) => container.resolve(token)
  });

  const app = express();
  app.set("port", process.env.PORT || 8080);
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

      const { username } = (() => {
        const decodedToken = jwt.decode(token) as any;

        if (!decodedToken || decodedToken.type !== "auth") {
          throw new Error("Invalid token");
        }

        return decodedToken;
      })();

      const user = await container
        .resolve<UserRepository>("UserRepository")
        .getUser(username);

      if (!user) {
        return false;
      }

      return await new Promise<boolean>(res =>
        jwt.verify(token, user.tokenSecret, (err: any) => res(!err))
      );
    },
    currentUserChecker: async action => {
      const token = getToken(action.request.get("Authorization"));

      if (!token) {
        return null;
      }

      const { username } = jwt.decode(token) as any;

      return container
        .resolve<UserRepository>("UserRepository")
        .getUser(username);
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
  app.listen(app.get("port"), () => {
    container
      .resolve<Logger>("Logger")
      .debug(`Listening on port ${app.get("port")}`);
  });
}

main();
