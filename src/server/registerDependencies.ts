import { container } from 'tsyringe';
import { MongoClient } from 'mongodb';
import CompositeLogger from './composite-logger';
import ConsoleLogger from './console-logger';
import MongoLogRepository from './repositories/MongoLogRepository';
import DatabaseLogger from './DatabaseLogger';
import MongoPostRepository from './repositories/MongoPostRepository';
import MongoUserRepository from './repositories/MongoUserRepository';

export default function registerDependencies(mongoClient: MongoClient): void {
  container
    .registerInstance('mongoDatabase', mongoClient.db())
    .registerType('PostRepository', MongoPostRepository)
    .registerType('UserRepository', MongoUserRepository)
    .registerType('LogRepository', MongoLogRepository)
    .registerInstance(
      'Logger',
      new CompositeLogger([
        container.resolve(ConsoleLogger),
        container.resolve(DatabaseLogger)
      ])
    );
}
