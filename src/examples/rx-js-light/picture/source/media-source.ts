import { ISubscribeFunction, single } from '@lifaon/rx-js-light';

export function mediaSource(
  src: string,
): ISubscribeFunction<string> {
  return single(src);
}
