import {ConsoleLogger} from "./console-logger";
import {Container} from "typedi";
import {Database} from "sqlite";
import {SqlLogRepository} from "./repositories/sql-log-repository";
import {SqlPostRepository} from "./repositories/sql-post-repository";
import {SqlUserRepository} from "./repositories/sql-user-repository";

export default function registerDependencies(db: Database): void {
  Container.set("Database", db);
  Container.set("PostRepository", new SqlPostRepository(db));
  Container.set("UserRepository", new SqlUserRepository(db));
  Container.set("LogRepository", new SqlLogRepository(db));
  Container.set("Logger", Container.get(ConsoleLogger));
}
