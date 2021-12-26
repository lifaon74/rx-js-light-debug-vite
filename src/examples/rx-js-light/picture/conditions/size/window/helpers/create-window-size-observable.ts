import { fromEventTarget, IObservable, map$$, merge, single } from '@lifaon/rx-js-light';
import { ISize } from '../../../../../../misc/types/size/size.type';
import { getWindowSize } from './get-window-size';

export function createWindowSizeObservable(): IObservable<ISize> {
  return map$$<Event, ISize>(fromEventTarget(window, 'resize'), getWindowSize);
}

export function createWindowSizeObservableInitialized(): IObservable<ISize> {
  return merge([
    createWindowSizeObservable(),
    single(getWindowSize()),
  ]);
}
