import { IObservable } from '@lirx/core';
import { maxSizeWindow } from './max-size-window';

export function maxWidthWindow(
  width: number,
): IObservable<boolean> {
  return maxSizeWindow({ width });
}
