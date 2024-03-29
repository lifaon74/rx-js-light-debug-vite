import { IObservable, readObservableValue } from '@lirx/core';
import { IReadonlyOptionsSet } from './types/readonly-options-set.type';

export function readSelectedOptionsObservableValue<GOption>(
  selectedOptions$: IObservable<IReadonlyOptionsSet<GOption>>,
): IReadonlyOptionsSet<GOption> {
  return readObservableValue(selectedOptions$, (): never => {
    throw new Error(`Cannot read selectedOptions$`);
  });
}
