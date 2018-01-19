import {Container} from "typedi";
import {SqlPostRepository} from "./repositories/sql-post-repository";
import {SqlUserRepository} from "./repositories/sql-user-repository";
import {Database} from "sqlite";

export default function registerDependencies(db: Database) {
  Container.set("PostRepository", new SqlPostRepository(db));
  Container.set("UserRepository", new SqlUserRepository(db));
}
