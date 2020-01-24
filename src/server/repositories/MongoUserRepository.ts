import { UserRepository } from "./user-repository";
import User from ":entities/user";
import { injectable, inject } from "tsyringe";
import { Db as MongoDatabase } from "mongodb";

@injectable()
export default class MongoUserRepository implements UserRepository {

  constructor(@inject("mongoDatabase") private db: MongoDatabase) { }

  async getUser(username: string): Promise<User | null> {
    return await this.db.collection("users").findOne({
      username
    });
  }

  createUser(_username: string, _name: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  getUserCount(): Promise<number> {
    return this.db.collection("users").count();
  }

  addAdmin(_userId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async storeTokenSecret(userId: string, secret: string): Promise<void> {
    await this.db.collection("users").updateOne({ _id: userId }, { tokenSecret: secret });
  }

  async storePasswordHash(userId: string, hash: string): Promise<void> {
    await this.db.collection("users").updateOne({ _id: userId }, { passwordHash: hash });
  }

  async storeAuthenticatorSecret(userId: string, secret: string): Promise<void> {
    await this.db.collection("users").updateOne({ _id: userId }, { authenticatorSecret: secret });
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.db.collection<User>("users").findOne({ _id: userId });

    return !!user && user.isAdmin;
  }
}