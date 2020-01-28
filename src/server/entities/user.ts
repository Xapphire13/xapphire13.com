export default interface User {
  username: string;
  name: string;
  passwordHash: string;
  tokenSecret: string;
  authenticatorSecret: string;
  isAdmin: boolean;
}
