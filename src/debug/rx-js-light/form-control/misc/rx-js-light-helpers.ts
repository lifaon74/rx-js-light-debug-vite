import {
  debounceImmediateObservablePipe, distinct$$$, IObservable, IObservablePipe, pipe$$$, shareRL$$$
} from '@lifaon/rx-js-light';

export function distinctDebouncedShared$$$<GValue>(): IObservablePipe<GValue, GValue> {
  return pipe$$$([
    distinct$$$<GValue>(),
    // debounce$$$<GValue>(0),
    debounceImmediateObservablePipe<GValue>(),
    shareRL$$$<GValue>(),
  ]);
}


export function distinctDebouncedShared$$<GValue>(
  subscribeFunction: IObservable<GValue>
): IObservable<GValue> {
  return distinctDebouncedShared$$$<GValue>()(subscribeFunction);
}
