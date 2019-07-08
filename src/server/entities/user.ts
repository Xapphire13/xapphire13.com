export default interface User {
  id: number;
  username: string;
  name: string;
  passwordHash: string;
  tokenSecret: string;
  authenticatorSecret: string;
}