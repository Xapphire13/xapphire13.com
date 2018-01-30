import {Container} from "typedi";
import {SqlPostRepository} from "./repositories/sql-post-repository";
import {SqlUserRepository} from "./repositories/sql-user-repository";
import {SqlLogRepository} from "./repositories/sql-log-repository";
import {Database} from "sqlite";
import {ConsoleLogger} from "./console-logger";

export default function registerDependencies(db: Database) {
  Container.set("Database", db);
  Container.set("PostRepository", new SqlPostRepository(db));
  Container.set("UserRepository", new SqlUserRepository(db));
  Container.set("LogRepository", new SqlLogRepository(db));
  Container.set("Logger", Container.get(ConsoleLogger));
}
