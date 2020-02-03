import { container } from 'tsyringe';
import { MongoClient } from 'mongodb';
import CompositeLogger from './composite-logger';
import ConsoleLogger from './console-logger';
import MongoLogRepository from './repositories/MongoLogRepository';
import DatabaseLogger from './DatabaseLogger';
import MongoPostRepository from './repositories/MongoPostRepository';
import MongoUserRepository from './repositories/MongoUserRepository';
import ExperimentResolver from './resolvers/ExperimentResolver';

export default function registerDependencies(mongoClient: MongoClient): void {
  container
    .registerInstance('mongoDatabase', mongoClient.db())
    .registerSingleton('PostRepository', MongoPostRepository)
    .registerSingleton('UserRepository', MongoUserRepository)
    .registerSingleton('LogRepository', MongoLogRepository)
    .registerSingleton('Resolver', ExperimentResolver)
    .registerInstance(
      'Logger',
      new CompositeLogger([
        container.resolve(ConsoleLogger),
        container.resolve(DatabaseLogger)
      ])
    );
}
