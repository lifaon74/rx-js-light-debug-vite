import { normalizePath } from './normalize-path';


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


