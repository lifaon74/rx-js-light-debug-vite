import { IObservable } from '@lifaon/rx-js-light';
import { maxSizeElement } from './max-size-element';

export function maxWidthElement(
  element: Element,
  width: number,
): IObservable<boolean> {
  return maxSizeElement(element, { width });
}
