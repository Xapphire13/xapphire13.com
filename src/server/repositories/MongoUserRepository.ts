import { UserRepository } from "./user-repository";
import User from ":entities/user";
import { injectable, inject } from "tsyringe";
import { Db as MongoDatabase, Collection } from "mongodb";

@injectable()
export default class MongoUserRepository implements UserRepository {

  private userCollection: Collection<User>;

  constructor(@inject("mongoDatabase") db: MongoDatabase) {
    this.userCollection = db.collection("users");
  }

  async getUser(username: string): Promise<User | null> {
    const result = await this.userCollection.findOne({
      username
    });

    if (result) {
      result.id = (result as any)._id;
    }

    return result;
  }

  createUser(_username: string, _name: string): Promise<string> {
    throw new Error("Method not implemented.");
  }

  getUserCount(): Promise<number> {
    return this.userCollection.count();
  }

  addAdmin(_userId: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  async storeTokenSecret(userId: string, secret: string): Promise<void> {
    await this.userCollection.updateOne({ _id: userId }, { tokenSecret: secret });
  }

  async storePasswordHash(userId: string, hash: string): Promise<void> {
    await this.userCollection.updateOne({ _id: userId }, { passwordHash: hash });
  }

  async storeAuthenticatorSecret(userId: string, secret: string): Promise<void> {
    await this.userCollection.updateOne({ _id: userId }, { authenticatorSecret: secret });
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.userCollection.findOne({ _id: userId });

    return !!user && user.isAdmin;
  }
}