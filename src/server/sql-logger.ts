import { inject, injectable } from 'tsyringe';
import { LogRepository } from './repositories/LogRepository';
import { Logger } from './logger';

@injectable()
export default class DatabaseLogger implements Logger {
  constructor(@inject('LogRepository') private repository: LogRepository) {}

  public debug(): Promise<void> {
    return Promise.resolve();
  }

  public log(message: string): Promise<any> {
    return this.repository.createLog(1, message);
  }

  public error(message: string): Promise<void>;

  public error(exception: Error): Promise<void>;

  public error(messageOrException: string | Error): Promise<any> {
    let message: string | undefined;
    let exception: string | undefined;

    if (typeof messageOrException === 'string') {
      message = messageOrException;
    } else {
      message = messageOrException.message;
      exception = messageOrException.stack;
    }

    return this.repository.createLog(0, message, exception);
  }
}
