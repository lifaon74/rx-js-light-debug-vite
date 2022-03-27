import { distinct$$, IObservable, shareRL$$ } from '@lifaon/rx-js-light';

export function distinctSharedR$$<GValue>(
  subscribe: IObservable<GValue>,
): IObservable<GValue> {
  return shareRL$$(distinct$$<GValue>(subscribe));
}
