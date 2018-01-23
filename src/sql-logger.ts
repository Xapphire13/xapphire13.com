import {Logger} from "./logger";
import {Database} from "sqlite";
import {Inject} from "typedi";
import sql = require("sql-tagged-template-literal");

export class SqlLogger implements Logger {
  constructor(@Inject("Database") private db: Database) {}

  public debug(): Promise<void> {
    return Promise.resolve();
  }

  public log(message: string): Promise<any> {
    return this.db.exec(sql`
      INSERT INTO Log (timestamp, message, level)
      VALUES (datetime("now"), ${message}, 1);
      `);
  }

  public error(message: string): Promise<void>
  public error(exception: Error): Promise<void>
  public error(messageOrException: string | Error): Promise<any> {
    let message: string | undefined;
    let exception: string | undefined;

    if (typeof(messageOrException) === "string") {
      message = messageOrException;
    } else {
      message = messageOrException.message;
      exception = messageOrException.stack;
    }

    return this.db.exec(sql`
      INSERT INTO Log (timestamp, message, exception, level)
      VALUES (datetime("now"), ${message}, ${exception}, 0);
      `);
  }
}
