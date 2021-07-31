import { fromResizeObserver, ISubscribeFunction, merge, single } from '@lifaon/rx-js-light';
import { ISize } from '../../../../../../misc/types/size/size.type';
import { map$$ } from '@lifaon/rx-js-light-shortcuts';
import { getElementSizeFromResizeObserverEntry } from './get-element-size-from-resize-observer-entry';
import { getElementSize } from './get-element-size';

export function createSubscribeFunctionOfElementSize(
  element: Element,
): ISubscribeFunction<ISize> {
  return map$$<ResizeObserverEntry, ISize>(fromResizeObserver(element), getElementSizeFromResizeObserverEntry);
}

export function createSubscribeFunctionOfElementSizeInitialized(
  element: Element,
): ISubscribeFunction<ISize> {
  return merge([
    createSubscribeFunctionOfElementSize(element),
    single(getElementSize(element)),
  ]);
}
