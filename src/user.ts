export interface User {
  id: number;
  name: string;
  passwordHash: string;
  tokenSecret: string;
}
