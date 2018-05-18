import {Database} from "sqlite";
import {User} from "xapphire13-entities";
import {UserRepository} from "./user-repository";
import {decorators} from "tsyringe";
const {inject, injectable} = decorators;

@injectable()
export class SqlUserRepository implements UserRepository {
  constructor(@inject("database") private db: Database) {}

  public async getUser(username: string): Promise<User> {
    const record = await this.db.get(`
      SELECT *
      FROM User
      WHERE username = $username COLLATE NOCASE;
      `, {$username: username});

    if (!record) {
      throw new Error("User doesn't exist");
    }

    return {
      id: record.id,
      username: record.username,
      name: record.name,
      passwordHash: record.password_hash,
      tokenSecret: record.token_secret,
      authenticatorSecret: record.authenticator_secret
    };
  }

  public async isAdmin(userId: number): Promise<boolean> {
    return !!await this.db.get(`
      SELECT *
      FROM Admins
      INNER JOIN User on Admins.user_id = User.id
      WHERE user_id = $userId;
      `, {$userId: userId});
  }

  public storeTokenSecret(userId: number, secret: string): Promise<any> {
    return this.db.run(`
      UPDATE User
      SET token_secret = ($secret)
      WHERE id = $userId;
      `, {
        $secret : secret,
        $userId: userId
      });
  }

  public storePasswordHash(userId: number, hash: string): Promise<any> {
    return this.db.run(`
      UPDATE User
      SET password_hash = ($hash)
      WHERE id = $userId;
      `, {
        $hash: hash,
        $userId: userId
      });
  }

  public storeAuthenticatorSecret(userId: number, secret: string): Promise<any> {
    return this.db.run(`
      UPDATE User
      SET authenticator_secret = ($secret)
      WHERE id = $userId;
      `, {
        $secret: secret,
        $userId: userId
      });
  }
}
