import { fromResizeObserver, IObservable, map$$, merge, single } from '@lifaon/rx-js-light';
import { ISize } from '../../../../../../misc/types/size/size.type';
import { getElementSizeFromResizeObserverEntry } from './get-element-size-from-resize-observer-entry';
import { getElementSize } from './get-element-size';

export function createElementSizeObservable(
  element: Element,
): IObservable<ISize> {
  return map$$<ResizeObserverEntry, ISize>(fromResizeObserver(element), getElementSizeFromResizeObserverEntry);
}

export function createElementSizeObservableInitialized(
  element: Element,
): IObservable<ISize> {
  return merge([
    createElementSizeObservable(element),
    single(getElementSize(element)),
  ]);
}
