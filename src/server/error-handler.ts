import {
  ExpressErrorMiddlewareInterface,
  Middleware,
  UnauthorizedError
} from 'routing-controllers';
import { NextFunction, Request, Response } from 'express';
import Boom from 'boom';
import { inject, injectable } from 'tsyringe';
import { Logger } from './logger';

@Middleware({ type: 'after' })
@injectable()
export default class ErrorHandler implements ExpressErrorMiddlewareInterface {
  constructor(@inject('Logger') private logger: Logger) {}

  public error(
    err: any,
    _req: Request,
    res: Response,
    _next: NextFunction
  ): void {
    let boomError: Boom = Boom.isBoom(err) ? err : Boom.badImplementation(err);

    if (err instanceof UnauthorizedError) {
      boomError = Boom.unauthorized(err.message);
    }

    if (boomError.isServer) {
      this.logger.error(boomError);
    }

    res.status(boomError.output.statusCode).json(boomError.output.payload);
  }
}
