import {CompositeLogger} from "./composite-logger";
import {ConsoleLogger} from "./console-logger";
import {Database} from "sqlite";
import {SqlLogRepository} from "./repositories/sql-log-repository";
import {SqlLogger} from "./sql-logger";
import {SqlPostRepository} from "./repositories/sql-post-repository";
import {SqlUserRepository} from "./repositories/sql-user-repository";
import {container} from "tsyringe";

export default function registerDependencies(db: Database): void {
  container.register({token: "database", useValue: db});
  container.register({token: "PostRepository", useClass: SqlPostRepository});
  container.register({token: "UserRepository", useClass: SqlUserRepository});
  container.register({token: "LogRepository", useClass: SqlLogRepository});
  container.register({token: "Logger", useValue: new CompositeLogger([
    container.resolve(ConsoleLogger),
    container.resolve(SqlLogger)
  ])});
}
