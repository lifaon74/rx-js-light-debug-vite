import { IObservable } from '@lirx/core';
import { maxSizeElement } from './max-size-element';

export function maxWidthWithAspectRatioElement(
  element: Element,
  width: number,
  aspectRatio: number,
): IObservable<boolean> {
  return maxSizeElement(element, { width, height: width / aspectRatio });
}
