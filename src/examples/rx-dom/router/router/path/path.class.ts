export function normalizePath(
  path: string,
): string {
  return new URL(path, window.origin).pathname;
}

export class Path {
  protected _path: string;

  constructor(
    path: string,
  ) {
    this._path = normalizePath(path);
  }

  toString(): string {
    return this._path;
  }
}

