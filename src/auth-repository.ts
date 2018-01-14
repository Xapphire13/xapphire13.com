import {User} from "./user";

export interface AuthRepository {
  getAdmin(): Promise<User>;
  storeSecret(userId: number, secret: string): Promise<void>;
  storePasswordHash(userId: number, hash: string): Promise<void>;
}
