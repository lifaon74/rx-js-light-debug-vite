import { distinct$$, IObservable, shareRL$$ } from '@lirx/core';

export function distinctSharedR$$<GValue>(
  subscribe: IObservable<GValue>,
): IObservable<GValue> {
  return shareRL$$(distinct$$<GValue>(subscribe));
}
