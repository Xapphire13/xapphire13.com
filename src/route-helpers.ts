import * as boom from "boom";
import * as express from "express";
import * as jwt from "jsonwebtoken";
import {UserRepository} from "./user-repository";
import {User} from "./user";

export interface Request<TQuery = void, TParams = void, TBody = void> extends express.Request {
  query: TQuery;
  params: TParams;
  body: TBody;
}

export function adminRoute(userRepository: UserRepository, handler: express.RequestHandler): express.RequestHandler {
  return (req, res, next) => authenticationInfo(userRepository, (authInfo) => {
    if (!authInfo || !authInfo.admin) {
      throw boom.unauthorized();
    }

    return handler;
  })(req, res, next);
}

export function asyncRoute(handler: express.RequestHandler): express.RequestHandler {
  return async (req, res, next) => {
    try {
      await Promise.resolve(handler(req, res, next));
    } catch (err) {
      next(err);
    }
  }
}

export type AuthInfo = {user: User, admin: boolean};

export function authenticationInfo(
  userRepository: UserRepository,
  handler: (authInfo: AuthInfo | null) => express.RequestHandler
): express.RequestHandler {
  return asyncRoute(async (req, res, next) => {
    const matches = /Bearer (.*)/i.exec(req.get("Authorization") || "");
    const token = matches && matches[1];

    if (!token) {
      return handler(null)(req, res, next);
    }

    const decodedToken = (() => {
      const decodedToken = jwt.decode(token);

      if (!decodedToken) {
        throw boom.unauthorized("Invalid token");
      }

      return decodedToken as {username: string, type: string};
    })();

    const user = await userRepository.getUser(decodedToken.username);
    if (!user) {
      throw boom.badRequest("Invalid user");
    }

    const tokenValid = () => new Promise<boolean>((res, rej) => jwt.verify(token, user.tokenSecret, (err, valid) => err ? rej(err) : res(!!valid)));
    if (decodedToken.type !== "auth" || !await tokenValid()) {
      throw boom.unauthorized("Token isn't valid");
    }

    const authInfo: AuthInfo = {
      user,
      admin: await userRepository.isAdmin(user.id)
    };

    return (await Promise.resolve((handler(authInfo))))(req, res, next);
  });
}
