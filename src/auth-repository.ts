import {User} from "./user";

export interface AuthRepository {
  getAdmin(): Promise<User>;
  storeTokenSecret(userId: string, secret: string): Promise<void>;
  storePasswordHash(userId: string, hash: string): Promise<void>;
  storeAuthenticatorSecret(userId: string, secret: string): Promise<void>;
}
