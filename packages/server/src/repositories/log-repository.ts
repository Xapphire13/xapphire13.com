import {Log} from "xapphire13-entities";

export interface LogRepository {
  createLog(level: number, message: string, exception?: string): Promise<void>;
  getLogs(pageSize: number, fromTimestamp?: string): Promise<Log[]>;
}
