/* eslint-disable class-methods-use-this */
/* eslint-disable no-console */
import { Logger } from './logger';

export default class ConsoleLogger implements Logger {
  public debug(message: string): Promise<void> {
    return this.log(message);
  }

  public log(message: string): Promise<void> {
    console.log(message);

    return Promise.resolve();
  }

  public error(message: string): Promise<void>;

  public error(exception: Error): Promise<void>;

  public error(messageOrException: string | Error): Promise<void> {
    console.error(messageOrException);

    return Promise.resolve();
  }
}
