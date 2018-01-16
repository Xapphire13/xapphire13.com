import {User} from "./user";

export interface UserRepository {
  getUser(userId: string): Promise<User>;
  storeTokenSecret(userId: string, secret: string): Promise<void>;
  storePasswordHash(userId: string, hash: string): Promise<void>;
  storeAuthenticatorSecret(userId: string, secret: string): Promise<void>;
  isAdmin(userId: string): Promise<boolean>;
}
