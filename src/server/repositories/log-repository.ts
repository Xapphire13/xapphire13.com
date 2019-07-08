import Log from "../entities/log";

export interface LogRepository {
  createLog(level: number, message: string, exception?: string): Promise<void>;
  getLogs(pageSize: number, fromTimestamp?: string): Promise<Log[]>;
}
