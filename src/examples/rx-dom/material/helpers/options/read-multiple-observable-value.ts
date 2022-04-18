import { IObservable, readObservableValue } from '@lirx/core';

export function readMultipleObservableValue(
  multiple$: IObservable<boolean>,
): boolean {
  return readObservableValue(multiple$, (): never => {
    throw new Error(`Cannot read multiple$`);
  });
}
