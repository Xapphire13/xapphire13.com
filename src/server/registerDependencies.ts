import { CompositeLogger } from "./composite-logger";
import { ConsoleLogger } from "./console-logger";
import { Database } from "sqlite";
import MongoLogRepository from "./repositories/MongoLogRepository";
import DatabaseLogger from "./sql-logger";
import MongoPostRepository from "./repositories/MongoPostRepository";
import { container } from "tsyringe";
import { MongoClient } from "mongodb";
import MongoUserRepository from "./repositories/MongoUserRepository";

export default function registerDependencies(db: Database, mongoClient: MongoClient): void {
  container.registerInstance("database", db)
    .registerInstance("mongoDatabase", mongoClient.db())
    .registerType("PostRepository", MongoPostRepository)
    .registerType("UserRepository", MongoUserRepository)
    .registerType("LogRepository", MongoLogRepository)
    .registerInstance("Logger", new CompositeLogger([
      container.resolve(ConsoleLogger),
      container.resolve(DatabaseLogger)
    ]));
}
