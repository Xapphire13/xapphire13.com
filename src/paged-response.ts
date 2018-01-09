export interface PagedResponse<T> {
  values: T[];
  continuationToken: string | null;
}
