import { IValueOrPromiseLikeFactory } from './types/others/value-or-promise-like/value-or-promise-like-factory.type';
import { valueOrPromiseLikeFactoryToPromise } from './types/others/value-or-promise-like/value-or-promise-like-factory-to-promise';

export type IFailsFunction = IValueOrPromiseLikeFactory<any>;

/**
 * Returns a promise resolved with true if calling 'failsFunction' throws, else the promise is resolved with false
 */
export function fails(
  failsFunction: IFailsFunction,
): Promise<boolean> {
  return valueOrPromiseLikeFactoryToPromise<any>(failsFunction)
    .then(() => false, () => true);
}
