import {User} from "./models/user";

export class AuthManager {
  private username: string | null;
  private token: string | null;
  private storage: Storage;

  constructor() {
    this.storage = window.localStorage;
    this.username = this.storage.getItem("username") || null;
    this.token = this.storage.getItem("token") || null;
  }

  public get user(): User | null {
    return this.username ? {username: this.username} : null;
  }

  public onSignedIn(username: string, token: string): void {
    this.storage.setItem("username", this.username = username);
    this.storage.setItem("token", this.token = token);
  }

  public signOut(): void {
    this.username = null;
    this.token = null;
    this.storage.removeItem("username");
    this.storage.removeItem("token");
  }
}
