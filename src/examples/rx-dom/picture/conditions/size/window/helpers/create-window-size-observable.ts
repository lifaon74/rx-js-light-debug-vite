import { fromEventTarget, IObservable, map$$, merge, reference } from '@lirx/core';
import { ISize } from '../../../../../../misc/types/size/size.type';
import { getWindowSize } from './get-window-size';

export function createWindowSizeObservable(): IObservable<ISize> {
  return map$$<Event, ISize>(fromEventTarget(window, 'resize'), getWindowSize);
}

export function createWindowSizeObservableInitialized(): IObservable<ISize> {
  return merge([
    createWindowSizeObservable(),
    reference(getWindowSize),
  ]);
}
