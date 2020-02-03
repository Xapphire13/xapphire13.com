export default function notNull<T>(it: T | null | undefined): it is T {
  return !!it;
}
