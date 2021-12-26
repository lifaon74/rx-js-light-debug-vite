export function normalizeRoutePath(
  path: string,
): string {
  return new URL(path, window.origin).pathname;
}
