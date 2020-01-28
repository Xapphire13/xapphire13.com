import { CrossStorageClient } from 'cross-storage';
import { User } from './models/user';

export class AuthManager {
  private username: Promise<string | null>;

  private token: Promise<string | null>;

  private storageClient: CrossStorageClient;

  constructor() {
    this.storageClient = new CrossStorageClient(
      new URL('/app/storage.html', document.URL).toString(),
      { promise: Promise }
    );

    this.username = new Promise(setUsername => {
      this.token = new Promise(setToken => {
        this.storageClient.onConnect().then(async () => {
          setUsername(this.storageClient.get('username'));
          setToken(this.storageClient.get('token'));
        });
      });
    });
  }

  public get user(): Promise<User | null> {
    return (async () => {
      const username = await this.username;

      return username ? { username } : null;
    })();
  }

  public get authToken(): Promise<string | null> {
    return (async () => {
      const token = await this.token;

      return token || null;
    })();
  }

  public get isAuthorized(): Promise<boolean> {
    return (async () => !!(await this.username) && !!(await this.token))();
  }

  public async onSignedIn(username: string, token: string): Promise<void> {
    this.username = Promise.resolve(username);
    this.token = Promise.resolve(token);
    await this.storageClient.set('username', username);
    await this.storageClient.set('token', token);
  }

  public async signOut(): Promise<void> {
    this.username = Promise.resolve(null);
    this.token = Promise.resolve(null);
    await this.storageClient.del('username');
    await this.storageClient.del('token');
  }
}
