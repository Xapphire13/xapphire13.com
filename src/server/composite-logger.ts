import { Logger } from './logger';

export default class CompositeLogger implements Logger {
  constructor(private loggers: Logger[] = []) {}

  public debug(message: string): Promise<any> {
    return Promise.all(this.loggers.map(logger => logger.debug(message)));
  }

  public log(message: string): Promise<any> {
    return Promise.all(this.loggers.map(logger => logger.log(message)));
  }

  public error(message: string): Promise<void>;

  public error(exception: Error): Promise<void>;

  public error(messageOrException: string | Error): Promise<any> {
    return Promise.all(
      this.loggers.map(logger => logger.error(messageOrException as any))
    );
  }
}
