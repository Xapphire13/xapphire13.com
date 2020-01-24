import { Database } from "sqlite";
import { UserRepository } from "./user-repository";
import { inject, injectable } from "tsyringe";
import User from "../entities/user";

@injectable()
export class SqlUserRepository implements UserRepository {
  constructor(@inject("database") private db: Database) { }

  public async getUser(username: string): Promise<User | null> {
    const record = await this.db.get(
      `
      SELECT *
      FROM User
      WHERE username = $username COLLATE NOCASE;
      `,
      { $username: username }
    );

    if (!record) {
      return null;
    }

    return {
      id: record.id,
      username: record.username,
      name: record.name,
      passwordHash: record.password_hash,
      tokenSecret: record.token_secret,
      authenticatorSecret: record.authenticator_secret,
      isAdmin: false
    };
  }

  public async createUser(username: string, name: string): Promise<string> {
    const result = await this.db.run(
      `
      INSERT INTO User (username, name)
      VALUES ($username, $name);
      `,
      { $username: username, $name: name }
    );

    return String(result.lastID);
  }

  public async getUserCount(): Promise<number> {
    const record = await this.db.get(
      `
      SELECT COUNT(*) as count
      FROM User;
      `
    );

    return record.count;
  }

  public async isAdmin(userId: string): Promise<boolean> {
    return !!(await this.db.get(
      `
      SELECT *
      FROM Admins
      INNER JOIN User on Admins.user_id = User.id
      WHERE user_id = $userId;
      `,
      { $userId: userId }
    ));
  }

  public async addAdmin(userId: string): Promise<void> {
    await this.db.run(
      `
      INSERT INTO Admins
      VALUES ($userId)
      `,
      { $userId: userId }
    );
  }

  public storeTokenSecret(userId: string, secret: string): Promise<any> {
    return this.db.run(
      `
      UPDATE User
      SET token_secret = ($secret)
      WHERE id = $userId;
      `,
      {
        $secret: secret,
        $userId: userId
      }
    );
  }

  public storePasswordHash(userId: string, hash: string): Promise<any> {
    return this.db.run(
      `
      UPDATE User
      SET password_hash = ($hash)
      WHERE id = $userId;
      `,
      {
        $hash: hash,
        $userId: userId
      }
    );
  }

  public storeAuthenticatorSecret(
    userId: string,
    secret: string
  ): Promise<any> {
    return this.db.run(
      `
      UPDATE User
      SET authenticator_secret = ($secret)
      WHERE id = $userId;
      `,
      {
        $secret: secret,
        $userId: userId
      }
    );
  }
}
