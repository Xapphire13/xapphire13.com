import {Container} from "typedi";
import {SqlPostRepository} from "./repositories/sql-post-repository";
import {SqlUserRepository} from "./repositories/sql-user-repository";
import {Database} from "sqlite";
import {CompositeLogger} from "./composite-logger";
import {SqlLogger} from "./sql-logger";
import {ConsoleLogger} from "./console-logger";

export default function registerDependencies(db: Database) {
  Container.set("Database", db);
  Container.set("PostRepository", new SqlPostRepository(db));
  Container.set("UserRepository", new SqlUserRepository(db));
  Container.set("Logger", new CompositeLogger([
    Container.get(ConsoleLogger),
    Container.get(SqlLogger)
  ]));
}
