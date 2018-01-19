import {Database} from "sqlite";
import {UserRepository} from "./user-repository";
import {User} from "../models/user";
import sql = require("sql-tagged-template-literal");

export class SqlUserRepository implements UserRepository {
  constructor(private db: Database) {}

  public async getUser(username: string): Promise<User> {
    const record = await this.db.get(sql`
      SELECT *
      FROM User
      WHERE username = ${username};
      `);

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
    }
  }

  public async isAdmin(userId: number): Promise<boolean> {
    return !!await this.db.get(sql`
      SELECT *
      FROM Admins
      INNER JOIN User on Admins.user_id = User.id;
      WHERE user_id = ${userId}
      `);
  }

  public storeTokenSecret(userId: number, secret: string): Promise<any> {
    return this.db.exec(sql`
      UPDATE User
      SET token_secret = (${secret})
      WHERE id = ${userId};
      `);
  }

  public storePasswordHash(userId: number, hash: string): Promise<any> {
    return this.db.exec(sql`
      UPDATE User
      SET password_hash = (${hash})
      WHERE id = ${userId};
      `);
  }

  public storeAuthenticatorSecret(userId: number, secret: string): Promise<any> {
    return this.db.exec(sql`
      UPDATE User
      SET authenticator_secret = (${secret})
      WHERE id = ${userId};
      `);
  }
}
