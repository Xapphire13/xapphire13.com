import { inject, injectable } from 'tsyringe';
import { Db as MongoDatabase, Collection } from 'mongodb';
import { LogRepository } from './LogRepository';
import Log from '../models/log';

@injectable()
export default class MongoLogRepository implements LogRepository {
  private logCollection: Collection<Log>;

  constructor(@inject('mongoDatabase') db: MongoDatabase) {
    this.logCollection = db.collection('logs');
  }

  public async createLog(
    level: number,
    message: string,
    exception?: string
  ): Promise<void> {
    await this.logCollection.insertOne({
      level,
      message,
      exception,
      timestamp: new Date()
    });
  }

  public getLogs(pageSize: number, from?: Date): Promise<Log[]> {
    return this.logCollection
      .find({
        timestamp: {
          $lte: from || new Date()
        }
      })
      .limit(pageSize)
      .toArray();
  }
}
