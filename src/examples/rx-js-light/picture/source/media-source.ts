import { IObservable, single } from '@lifaon/rx-js-light';

export function mediaSource(
  src: string,
): IObservable<string> {
  return single(src);
}
