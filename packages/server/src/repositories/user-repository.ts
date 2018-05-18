import {User} from "xapphire13-entities";

export interface UserRepository {
  getUser(username: string): Promise<User>;
  storeTokenSecret(userId: number, secret: string): Promise<void>;
  storePasswordHash(userId: number, hash: string): Promise<void>;
  storeAuthenticatorSecret(userId: number, secret: string): Promise<void>;
  isAdmin(userId: number): Promise<boolean>;
}
