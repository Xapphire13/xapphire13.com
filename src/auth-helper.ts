import * as express from "express";

export function isAuthorized(): boolean {
  return process.env.NODE_ENV !== "production";
}

export function protectedRoute(handler: express.RequestHandler): express.RequestHandler {
  return (req, res, next) => {
    if (!isAuthorized()) {
      return res.status(401).send();
    }

    return handler(req, res, next);
  };
}
