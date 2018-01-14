import {Database} from "sqlite";
import {AuthRepository} from "./auth-repository";
import {User} from "./user";
import sql = require("sql-tagged-template-literal");

export class SqlAuthRepository implements AuthRepository {
  constructor(private db: Database) {}

  public async getAdmin(): Promise<User> {
    const record = await this.db.get(sql`
      SELECT * FROM User
      LIMIT 1;
      `);

    return {
      id: record.id,
      name: record.name,
      passwordHash: record.password_hash,
      tokenSecret: record.token_secret,
      authenticatorSecret: record.authenticator_secret
    }
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
