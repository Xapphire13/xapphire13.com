import * as boom from "boom";
import * as express from "express";
import * as jwt from "jsonwebtoken";

export enum HttpMethod {
  GET,
  POST,
  PUT,
  PATCH,
  DELETE
};

export interface Request<TQuery = void, TParams = void, TBody = void> extends express.Request {
  query: TQuery;
  params: TParams;
  body: TBody;
}

export type AuthInfo = {
  username: string;
  token: string;
};

export type RouteHandlerParams<TQuery = void, TParams = void, TBody = void> = {
  req: Request<TQuery, TParams, TBody>;
  res: express.Response;
  authInfo: AuthInfo | null;
};

type RouteHander = (params: RouteHandlerParams) => any;

export abstract class ApiController {
  constructor(protected app: express.Application) {}

  public registerRoutes(): void {
    const routes: {[key: number]: {path: string, handler: Function}[]} = (<any>this).__routes__;

    (<[HttpMethod, express.IRouterMatcher<express.Application>][]>[
      [HttpMethod.GET, this.app.get.bind(this.app)],
      [HttpMethod.POST, this.app.post.bind(this.app)],
      [HttpMethod.PATCH, this.app.patch.bind(this.app)],
      [HttpMethod.PUT, this.app.put.bind(this.app)],
      [HttpMethod.DELETE, this.app.delete.bind(this.app)]
    ]).forEach(([method, matcher]) => routes[method] && routes[method].forEach(({path, handler}) => matcher(`/api/${path}`, this.handleRoute(handler.bind(this)))));
  }

  private handleRoute(handler: RouteHander): any {
    return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
      try {
        const authInfo = await this.getAuthInfo(req);
        const result = await Promise.resolve(handler({req, res, authInfo}));
        res.json(result);
      } catch (err) {
        next(err);
      }
    }
  }

  private async getAuthInfo(req: express.Request): Promise<AuthInfo | null> {
    const matches = /Bearer (.*)/i.exec(req.get("Authorization") || "");
    const token = matches && matches[1];

    if (!token) {
      return null;
    }

    const {username} = (() => {
      const decodedToken = jwt.decode(token);

      if (!decodedToken) {
        throw boom.unauthorized("Invalid token");
      }

      return decodedToken as {username: string, type: string};
    })();

    return {
      username,
      token
    };
  }
}

export function route(path: string, method: HttpMethod) {
    return function (target: any, key: string) {
        if (!target.__routes__) target.__routes__ = {};
        if (!target.__routes__[method]) target.__routes__[method] = [];

        target.__routes__[method].push({ path, handler: target[key] });
    }
}
