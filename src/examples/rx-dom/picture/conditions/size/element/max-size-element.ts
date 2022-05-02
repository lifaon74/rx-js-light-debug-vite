import { IPartialSize, ISize } from '../../../../../misc/types/size/size.type';
import { distinct$$$, IObservable, map$$$, pipe$$ } from '@lirx/core';
import { createElementSizeObservableInitialized } from './helpers/create-element-size-observable';
import { _isLowerThanOrEqualSize } from '../helpers/is-lower-than-or-equal-size';

export function maxSizeElement(
  element: Element,
  {
    width = Number.POSITIVE_INFINITY,
    height = Number.POSITIVE_INFINITY,
  }: IPartialSize,
): IObservable<boolean> {
  // return functionD$$(
  //   [createElementSizeObservableInitialized(element)],
  //   _isLowerThanOrEqualSize({ width, height }),
  // );
  return pipe$$(createElementSizeObservableInitialized(element), [
    map$$$<ISize, boolean>(_isLowerThanOrEqualSize({ width, height })),
    distinct$$$<boolean>(),
  ]);
  // return map$$<ISize, boolean>(
  //   createObservableOfElementSizeInitialized(element),
  //   _isLowerThanOrEqualSize({ width, height }),
  // );
}

// export function maxSizeDynamicElement(
//   element: IObservable<Element>,
//   size: IPartialSize,
// ): IObservable<boolean> {
//   return mergeMapS$$<Element, boolean>(element, (element: Element): IObservable<boolean> => {
//     return maxSizeElement(element, size);
//   });
// }
