import { fromEventTarget, IObservable, map$$, merge, single } from '@lifaon/rx-js-light';
import { ISize } from '../../../../../../misc/types/size/size.type';
import { getWindowSize } from './get-window-size';

export function createObservableOfWindowSize(): IObservable<ISize> {
  return map$$<Event, ISize>(fromEventTarget(window, 'resize'), getWindowSize);
}

export function createObservableOfWindowSizeInitialized(): IObservable<ISize> {
  return merge([
    createObservableOfWindowSize(),
    single(getWindowSize()),
  ]);
}
