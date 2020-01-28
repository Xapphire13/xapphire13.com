import User from "../entities/user";

export interface UserRepository {
  getUser(username: string): Promise<User | null>;
  storeTokenSecret(username: string, secret: string): Promise<void>;
  storePasswordHash(usename: string, hash: string): Promise<void>;
  storeAuthenticatorSecret(username: string, secret: string): Promise<void>;
  isAdmin(username: string): Promise<boolean>;
}
