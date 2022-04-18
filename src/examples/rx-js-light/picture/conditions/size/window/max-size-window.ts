import { IPartialSize, ISize } from '../../../../../misc/types/size/size.type';
import { IObservable, map$$ } from '@lirx/core';
import { createWindowSizeObservableInitialized } from './helpers/create-window-size-observable';
import { _isLowerThanOrEqualSize } from '../helpers/is-lower-than-or-equal-size';

export function maxSizeWindow(
  {
    width = Number.POSITIVE_INFINITY,
    height = Number.POSITIVE_INFINITY,
  }: IPartialSize,
): IObservable<boolean> {
  return map$$<ISize, boolean>(
    createWindowSizeObservableInitialized(),
    _isLowerThanOrEqualSize({ width, height }),
  );
}
