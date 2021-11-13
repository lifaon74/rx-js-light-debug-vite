import { IObservable, readObservableValue } from '@lifaon/rx-js-light';

export function readMultipleObservableValue(
  multiple$: IObservable<boolean>,
): boolean {
  return readObservableValue(multiple$, (): never => {
    throw new Error(`Cannot read multiple$`);
  });
}
