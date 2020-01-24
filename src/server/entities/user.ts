export default interface User {
  id: string;
  username: string;
  name: string;
  passwordHash: string;
  tokenSecret: string;
  authenticatorSecret: string;
  isAdmin: boolean;
}