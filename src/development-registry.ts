import {ConsoleLogger} from "./console-logger";
import {Database} from "sqlite";
import {SqlLogRepository} from "./repositories/sql-log-repository";
import {SqlPostRepository} from "./repositories/sql-post-repository";
import {SqlUserRepository} from "./repositories/sql-user-repository";
import {container} from "tsyringe";

export default function registerDependencies(db: Database): void {
  container.registerInstance("database", db)
    .registerType("PostRepository", SqlPostRepository)
    .registerType("UserRepository", SqlUserRepository)
    .registerType("LogRepository", SqlLogRepository)
    .registerType("Logger", ConsoleLogger);
}
