import User from "../entities/user";

export interface UserRepository {
  getUser(username: string): Promise<User | null>;
  createUser(username: string, name: string): Promise<number>;
  getUserCount(): Promise<number>;
  addAdmin(userId: number): Promise<void>;
  storeTokenSecret(userId: number, secret: string): Promise<void>;
  storePasswordHash(userId: number, hash: string): Promise<void>;
  storeAuthenticatorSecret(userId: number, secret: string): Promise<void>;
  isAdmin(userId: number): Promise<boolean>;
}
