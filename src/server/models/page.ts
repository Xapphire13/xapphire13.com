export default interface Page<T = any> {
  values: T[];
  continuationToken: string | null;
}
