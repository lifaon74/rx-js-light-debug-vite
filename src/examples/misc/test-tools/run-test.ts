import { IValueOrPromiseLikeFactory } from './types/others/value-or-promise-like/value-or-promise-like-factory.type';
import { valueOrPromiseLikeFactoryToPromise } from './types/others/value-or-promise-like/value-or-promise-like-factory-to-promise';

export type IRunTestFunction = IValueOrPromiseLikeFactory<void>;

// https://chrisyeh96.github.io/2020/03/28/terminal-colors.html

export function runTest(
  name: string,
  callback: IRunTestFunction,
): Promise<void> {
  // process.stdout.write('\x1b[36m');
  // process.stdout.write('running: ');
  // process.stdout.write('\x1b[33m');
  // process.stdout.write(name);
  // process.stdout.write('\x1b[0m');
  // process.stdout.write('\n');

  return valueOrPromiseLikeFactoryToPromise<void>(callback)
    .then(
      () => {
        if ('process' in globalThis) {
          (globalThis as any).process.stdout.write(`\x1b[32msuccess: \x1b[33m${ name }\x1b[0m\n`);
        } else {
          console.log(`%csuccess: %c${ name }`, 'color: #4e9a06', 'color: #c4a000');
        }
      },
      (error: any) => {
        if ('process' in globalThis) {
          (globalThis as any).process.stdout.write(`\x1b[31mfailed: \x1b[33m${ name }\x1b[0m\n`);
        } else {
          console.log(`%failed: %c${ name }`, 'color: #cc0000', 'color: #c4a000');
        }
        throw error;
      }
    );
}
