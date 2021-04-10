import { ISubscribeFunction, ISubscribePipeFunction } from '@lifaon/rx-js-light';
import { debounce$$$, distinct$$$, pipe$$$, shareR$$$ } from '@lifaon/rx-js-light-shortcuts';

export function distinctDebouncedShared$$$<GValue>(): ISubscribePipeFunction<GValue, GValue> {
  return pipe$$$([
    distinct$$$<GValue>(),
    debounce$$$<GValue>(0),
    shareR$$$<GValue>(),
  ]);
}


export function distinctDebouncedShared$$<GValue>(
  subscribeFunction: ISubscribeFunction<GValue>
): ISubscribeFunction<GValue> {
  return distinctDebouncedShared$$$<GValue>()(subscribeFunction);
}
