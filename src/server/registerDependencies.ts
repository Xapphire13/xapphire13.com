import { CompositeLogger } from "./composite-logger";
import { ConsoleLogger } from "./console-logger";
import { Database } from "sqlite";
import { SqlLogRepository } from "./repositories/sql-log-repository";
import { SqlLogger } from "./sql-logger";
import { SqlPostRepository } from "./repositories/sql-post-repository";
import { container } from "tsyringe";
import { MongoClient } from "mongodb";
import MongoUserRepository from "./repositories/MongoUserRepository";

export default function registerDependencies(db: Database, mongoClient: MongoClient): void {
  container.registerInstance("database", db)
    .registerInstance("mongoDatabase", mongoClient.db())
    .registerType("PostRepository", SqlPostRepository)
    .registerType("UserRepository", MongoUserRepository)
    .registerType("LogRepository", SqlLogRepository)
    .registerInstance("Logger", new CompositeLogger([
      container.resolve(ConsoleLogger),
      container.resolve(SqlLogger)
    ]));
}
