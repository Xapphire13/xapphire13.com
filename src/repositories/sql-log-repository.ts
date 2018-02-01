import {Database} from "sqlite";
import {Inject} from "typedi";
import {Log} from "../models/log";
import {LogRepository} from "./log-repository";

export class SqlLogRepository implements LogRepository {
  constructor(@Inject("database") private db: Database) {}

  public createLog(level: number, message: string, exception?: string): Promise<any> {
    return this.db.run(`
      INSERT INTO Log (timestamp, message, exception, level)
      VALUES (datetime("now"), $message, $exception, $level);
      `, {
        $message: message,
        $exception: exception,
        $level: level
      });
  }

  public getLogs(pageSize: number, fromTimestamp?: string): Promise<Log[]> {
    return this.db.all(`
      SELECT * FROM Log
      WHERE timestamp <= datetime($fromTimestamp)
      ORDER BY timestamp DESC
      LIMIT $pageSize;
      `, {
        $pageSize: pageSize,
        $fromTimestamp: fromTimestamp || new Date().toJSON()
      });
  }
}
