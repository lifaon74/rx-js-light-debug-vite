export function normalizePath(
  path: string,
): string {
  return new URL(path, window.origin).pathname;
}
