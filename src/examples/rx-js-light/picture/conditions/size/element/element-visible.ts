import { ISize } from '../../../../../misc/types/size/size.type';
import { distinct$$$, IObservable, map$$$, pipe$$ } from '@lirx/core';
import { createElementSizeObservableInitialized } from './helpers/create-element-size-observable';

export function elementVisible(
  element: Element,
): IObservable<boolean> {
  return pipe$$(createElementSizeObservableInitialized(element), [
    map$$$<ISize, boolean>(({ width, height }: ISize): boolean => {
      return (width !== 0)
        && (height !== 0);
    }),
    distinct$$$<boolean>(),
  ]);
}

export function elementInvisible(
  element: Element,
): IObservable<boolean> {
  return pipe$$(createElementSizeObservableInitialized(element), [
    map$$$<ISize, boolean>(({ width, height }: ISize): boolean => {
      return (width === 0)
        || (height === 0);
    }),
    distinct$$$<boolean>(),
  ]);
}
