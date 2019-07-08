import Log = Xapphire13.Entities.Log;

export interface LogRepository {
  createLog(level: number, message: string, exception?: string): Promise<void>;
  getLogs(pageSize: number, fromTimestamp?: string): Promise<Log[]>;
}
