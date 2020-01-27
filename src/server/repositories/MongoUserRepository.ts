import { UserRepository } from "./UserRepository";
import User from ":entities/user";
import { injectable, inject } from "tsyringe";
import { Db as MongoDatabase, Collection, ObjectId } from "mongodb";

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
      result.id = ((result as any)._id as ObjectId).toHexString();
    }

    return result;
  }

  async storeTokenSecret(userId: string, secret: string): Promise<void> {
    await this.userCollection.updateOne({ _id: userId }, { $set: { tokenSecret: secret } });
  }

  async storePasswordHash(userId: string, hash: string): Promise<void> {
    await this.userCollection.updateOne({ _id: userId }, { $set: { passwordHash: hash } });
  }

  async storeAuthenticatorSecret(userId: string, secret: string): Promise<void> {
    await this.userCollection.updateOne({ _id: userId }, { $set: { authenticatorSecret: secret } });
  }

  async isAdmin(userId: string): Promise<boolean> {
    const user = await this.userCollection.findOne({ _id: userId });

    return !!user && user.isAdmin;
  }
}