import { fromResizeObserver, IObservable, map$$, merge, single } from '@lifaon/rx-js-light';
import { ISize } from '../../../../../../misc/types/size/size.type';
import { getElementSizeFromResizeObserverEntry } from './get-element-size-from-resize-observer-entry';
import { getElementSize } from './get-element-size';

export function createObservableOfElementSize(
  element: Element,
): IObservable<ISize> {
  return map$$<ResizeObserverEntry, ISize>(fromResizeObserver(element), getElementSizeFromResizeObserverEntry);
}

export function createObservableOfElementSizeInitialized(
  element: Element,
): IObservable<ISize> {
  return merge([
    createObservableOfElementSize(element),
    single(getElementSize(element)),
  ]);
}
