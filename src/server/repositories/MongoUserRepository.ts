import { UserRepository } from "./UserRepository";
import User from ":entities/user";
import { injectable, inject } from "tsyringe";
import { Db as MongoDatabase, Collection } from "mongodb";

@injectable()
export default class MongoUserRepository implements UserRepository {

  private userCollection: Collection<User>;

  constructor(@inject("mongoDatabase") db: MongoDatabase) {
    this.userCollection = db.collection("users");
  }

  getUser(username: string): Promise<User | null> {
    return this.userCollection.findOne({
      username
    });
  }

  async storeTokenSecret(username: string, secret: string): Promise<void> {
    await this.userCollection.updateOne({ username: username }, { $set: { tokenSecret: secret } });
  }

  async storePasswordHash(username: string, hash: string): Promise<void> {
    await this.userCollection.updateOne({ username: username }, { $set: { passwordHash: hash } });
  }

  async storeAuthenticatorSecret(username: string, secret: string): Promise<void> {
    await this.userCollection.updateOne({ username: username }, { $set: { authenticatorSecret: secret } });
  }

  async isAdmin(username: string): Promise<boolean> {
    const user = await this.userCollection.findOne({ username: username });

    return !!user && user.isAdmin;
  }
}