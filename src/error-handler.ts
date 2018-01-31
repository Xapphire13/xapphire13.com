import * as boom from "boom";
import {ExpressErrorMiddlewareInterface, Middleware, UnauthorizedError} from "routing-controllers";
import {NextFunction, Request, Response} from "express";
import {Inject} from "typedi";
import {Logger} from "./logger";

@Middleware({type: "after"})
export class ErrorHandler implements ExpressErrorMiddlewareInterface {
  constructor(@Inject("Logger") private logger: Logger) {}

  public error(err: any, _req: Request, res: Response, _next: NextFunction): void {
      let boomError: boom.Boom = boom.isBoom(err) ? err : boom.badImplementation(err);

      if (err instanceof UnauthorizedError) {
        boomError = boom.unauthorized(err.message);
      }

      if (boomError.isServer) {
        this.logger.error(boomError);
      }

      res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
}
