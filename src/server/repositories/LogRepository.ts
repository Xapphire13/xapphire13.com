import Log from '../models/log';

export interface LogRepository {
  createLog(level: number, message: string, exception?: string): Promise<void>;
  getLogs(pageSize: number, from?: Date): Promise<Log[]>;
}
