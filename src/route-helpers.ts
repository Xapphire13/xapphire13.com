import * as boom from "boom";
import * as express from "express";
import {isAuthorized} from "./auth-helper";

export function protectedRoute(handler: express.RequestHandler): express.RequestHandler {
  return (req, res, next) => {
    if (!isAuthorized()) {
      throw boom.unauthorized();
    }

    return handler(req, res, next);
  };
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
