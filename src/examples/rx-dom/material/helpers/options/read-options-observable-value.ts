import { IObservable, readObservableValue } from '@lirx/core';
import { IReadonlyOptionsSet } from './types/readonly-options-set.type';

export function readOptionsObservableValue<GOption>(
  options$: IObservable<IReadonlyOptionsSet<GOption>>,
): IReadonlyOptionsSet<GOption> {
  return readObservableValue(options$, (): never => {
    throw new Error(`Cannot read options$`);
  });
}
