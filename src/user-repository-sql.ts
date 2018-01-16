import {Database} from "sqlite";
import {UserRepository} from "./user-repository";
import {User} from "./user";
import sql = require("sql-tagged-template-literal");

export class SqlUserRepository implements UserRepository {
  constructor(private db: Database) {}

  public async getUser(userId: string): Promise<User> {
    const record = await this.db.get(sql`
      SELECT *
      FROM User
      WHERE id = ${userId};
      `);

    return {
      id: record.id,
      name: record.name,
      passwordHash: record.password_hash,
      tokenSecret: record.token_secret,
      authenticatorSecret: record.authenticator_secret
    }
  }

  public async isAdmin(userId: string): Promise<boolean> {
    return !!await this.db.get(sql`
      SELECT *
      FROM Admins
      INNER JOIN User on Admins.user_id = User.id;
      WHERE user_id = ${userId}
      `);
  }

  public storeTokenSecret(userId: string, secret: string): Promise<any> {
    return this.db.exec(sql`
      UPDATE User
      SET token_secret = (${secret})
      WHERE id = ${userId};
      `);
  }

  public storePasswordHash(userId: string, hash: string): Promise<any> {
    return this.db.exec(sql`
      UPDATE User
      SET password_hash = (${hash})
      WHERE id = ${userId};
      `);
  }

  public storeAuthenticatorSecret(userId: string, secret: string): Promise<any> {
    return this.db.exec(sql`
      UPDATE User
      SET authenticator_secret = (${secret})
      WHERE id = ${userId};
      `);
  }
}
