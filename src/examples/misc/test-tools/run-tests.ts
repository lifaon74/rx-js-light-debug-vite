import { IValueOrPromiseLikeFactory } from './types/others/value-or-promise-like/value-or-promise-like-factory.type';
import { valueOrPromiseLikeFactoryToPromise } from './types/others/value-or-promise-like/value-or-promise-like-factory-to-promise';

export type IRunTestsFunction = IValueOrPromiseLikeFactory<void>;

export function runTests(
  callback: IRunTestsFunction,
): Promise<void> {
  return valueOrPromiseLikeFactoryToPromise<void>(callback)
    .then(
      () => {
        if ('process' in globalThis) {
          (globalThis as any).process.stdout.write(`\x1b[36mall tests passed with success\x1b[0m\n`);
        } else {
          console.log('%call tests passed with success', 'color: #06989a');
        }
      },
      (error: any) => {
        if ('process' in globalThis) {
          (globalThis as any).process.stdout.write(`\x1b[35msome tests failed\x1b[0m\n`);
        } else {
          console.log('%csome tests failed', 'color: #75507b');
        }

        console.log(error);
      }
    );
}
