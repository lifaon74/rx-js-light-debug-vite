import { IValueOrPromiseLikeFactory } from './value-or-promise-like-factory.type';

export function valueOrPromiseLikeFactoryToPromise<GValue>(
  factory: IValueOrPromiseLikeFactory<GValue>,
): Promise<GValue> {
  return new Promise<GValue>(resolve => resolve(factory()));
}

