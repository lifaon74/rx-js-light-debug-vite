import { IValueOrPromiseLike } from './value-or-promise-like.type';

export interface IValueOrPromiseLikeFactory<GValue> {
  (): IValueOrPromiseLike<GValue>;
}

