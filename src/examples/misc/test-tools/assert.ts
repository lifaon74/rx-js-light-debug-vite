import { valueOrPromiseLikeFactoryToPromise } from './types/others/value-or-promise-like/value-or-promise-like-factory-to-promise';
import { IValueOrPromiseLikeFactory } from './types/others/value-or-promise-like/value-or-promise-like-factory.type';

export type IAssertFunction = IValueOrPromiseLikeFactory<boolean>;

/**
 * Returns a promise rejected with an 'Assert' error if calling 'assertFunction' throws, or 'cb' returns false
 * @Example:
 *  await assert(() => [1, 2].length === 2);  // => wont throw
 *  await assert(() => [1, 2].length === 3);  // => will throw
 */
export function assert(
  assertFunction: IAssertFunction,
  message: string = assertFunction.toString(),
): Promise<void> {
  return valueOrPromiseLikeFactoryToPromise<boolean>(assertFunction)
    .then(
      (result: boolean): void => {
        if (!result) {
          throw new Error(`Assert failed: ${ message }`);
        }
      },
      (error: any): void => {
        throw new Error(`Assert failed - ${ error.message } -: ${ message }`);
      },
    );
}


