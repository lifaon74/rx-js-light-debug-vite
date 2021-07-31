import { IPartialSize, ISize } from '../../../../../misc/types/size/size.type';
import { ISubscribeFunction } from '@lifaon/rx-js-light';
import { distinct$$$, map$$$, pipe$$ } from '@lifaon/rx-js-light-shortcuts';
import { createSubscribeFunctionOfElementSizeInitialized } from './helpers/create-subscribe-function-of-element-size';
import { _isLowerThanOrEqualSize } from '../helpers/is-lower-than-or-equal-size';

export function maxSizeElement(
  element: Element,
  {
    width = Number.POSITIVE_INFINITY,
    height = Number.POSITIVE_INFINITY,
  }: IPartialSize,
): ISubscribeFunction<boolean> {
  return pipe$$(createSubscribeFunctionOfElementSizeInitialized(element), [
    map$$$<ISize, boolean>(_isLowerThanOrEqualSize({ width, height })),
    distinct$$$<boolean>(),
  ]);
  // return map$$<ISize, boolean>(
  //   createSubscribeFunctionOfElementSizeInitialized(element),
  //   _isLowerThanOrEqualSize({ width, height }),
  // );
}

// export function maxSizeDynamicElement(
//   element: ISubscribeFunction<Element>,
//   size: IPartialSize,
// ): ISubscribeFunction<boolean> {
//   return mergeMapS$$<Element, boolean>(element, (element: Element): ISubscribeFunction<boolean> => {
//     return maxSizeElement(element, size);
//   });
// }
