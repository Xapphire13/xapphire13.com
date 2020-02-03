import { injectable, inject } from 'tsyringe';
import { Db as MongoDatabase, Collection } from 'mongodb';
import { UserRepository } from './UserRepository';
import User from 'src/server/models/user';

@injectable()
export default class MongoUserRepository implements UserRepository {
  private userCollection: Collection<User>;

  constructor(@inject('mongoDatabase') db: MongoDatabase) {
    this.userCollection = db.collection('users');
  }

  getUser(username: string): Promise<User | null> {
    return this.userCollection.findOne({
      username
    });
  }

  async storeTokenSecret(username: string, secret: string): Promise<void> {
    await this.userCollection.updateOne(
      { username },
      { $set: { tokenSecret: secret } }
    );
  }

  async storePasswordHash(username: string, hash: string): Promise<void> {
    await this.userCollection.updateOne(
      { username },
      { $set: { passwordHash: hash } }
    );
  }

  async storeAuthenticatorSecret(
    username: string,
    secret: string
  ): Promise<void> {
    await this.userCollection.updateOne(
      { username },
      { $set: { authenticatorSecret: secret } }
    );
  }

  async isAdmin(username: string): Promise<boolean> {
    const user = await this.userCollection.findOne({ username });

    return !!user && user.isAdmin;
  }
}
