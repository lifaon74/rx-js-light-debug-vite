import { ISubscribeFunction } from '@lifaon/rx-js-light';
import { maxSizeWindow } from './max-size-window';

export function maxWidthWindow(
  width: number,
): ISubscribeFunction<boolean> {
  return maxSizeWindow({ width });
}
