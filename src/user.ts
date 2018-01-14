export interface User {
  id: string;
  name: string;
  passwordHash: string;
  tokenSecret: string;
  authenticatorSecret: string;
}
