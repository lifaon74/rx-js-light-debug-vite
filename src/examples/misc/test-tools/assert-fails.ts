import { assert } from './assert';
import { fails, IFailsFunction } from './fails';

/**
 * Returns a promise rejected if calling 'cb' doesn't throw
 */
export function assertFails(
  failsFunction: IFailsFunction,
  message: string = failsFunction.toString(),
): Promise<void> {
  return assert(() => fails(failsFunction), `expected to fail - ${ message }`);
}
