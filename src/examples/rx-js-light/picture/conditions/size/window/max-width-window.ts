import { IObservable } from '@lifaon/rx-js-light';
import { maxSizeWindow } from './max-size-window';

export function maxWidthWindow(
  width: number,
): IObservable<boolean> {
  return maxSizeWindow({ width });
}
