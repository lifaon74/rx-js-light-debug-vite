import { IPartialSize, ISize } from '../../../../../misc/types/size/size.type';
import { distinct$$$, IObservable, map$$$, pipe$$ } from '@lifaon/rx-js-light';
import { createObservableOfElementSizeInitialized } from './helpers/create-subscribe-function-of-element-size';
import { _isLowerThanOrEqualSize } from '../helpers/is-lower-than-or-equal-size';

export function maxSizeElement(
  element: Element,
  {
    width = Number.POSITIVE_INFINITY,
    height = Number.POSITIVE_INFINITY,
  }: IPartialSize,
): IObservable<boolean> {
  return pipe$$(createObservableOfElementSizeInitialized(element), [
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
