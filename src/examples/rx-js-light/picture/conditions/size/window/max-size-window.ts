import { IPartialSize, ISize } from '../../../../../misc/types/size/size.type';
import { ISubscribeFunction } from '@lifaon/rx-js-light';
import { map$$ } from '@lifaon/rx-js-light-shortcuts';
import { createSubscribeFunctionOfWindowSizeInitialized } from './helpers/create-subscribe-function-of-window-size';
import { _isLowerThanOrEqualSize } from '../helpers/is-lower-than-or-equal-size';

export function maxSizeWindow(
  {
    width = Number.POSITIVE_INFINITY,
    height = Number.POSITIVE_INFINITY,
  }: IPartialSize,
): ISubscribeFunction<boolean> {
  return map$$<ISize, boolean>(
    createSubscribeFunctionOfWindowSizeInitialized(),
    _isLowerThanOrEqualSize({ width, height }),
  );
}
