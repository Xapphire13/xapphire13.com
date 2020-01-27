import User from "../entities/user";

export interface UserRepository {
  getUser(username: string): Promise<User | null>;
  storeTokenSecret(userId: string, secret: string): Promise<void>;
  storePasswordHash(userId: string, hash: string): Promise<void>;
  storeAuthenticatorSecret(userId: string, secret: string): Promise<void>;
  isAdmin(userId: string): Promise<boolean>;
}
