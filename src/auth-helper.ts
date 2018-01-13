export function isAuthorized(): boolean {
  return process.env.NODE_ENV !== "production";
}
