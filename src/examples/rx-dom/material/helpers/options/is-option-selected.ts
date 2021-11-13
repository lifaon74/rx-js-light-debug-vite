import { IObservable, map$$ } from '@lifaon/rx-js-light';
import { IReadonlyOptionsSet } from './types/readonly-options-set.type';

/** FUNCTION **/

export interface IIsOptionSelectedOptions<GOption> {
  readonly selectedOptions$: IObservable<IReadonlyOptionsSet<GOption>>;
  readonly option: GOption;
}

export function isOptionSelected<GOption>(
  {
    selectedOptions$,
    option,
  }: IIsOptionSelectedOptions<GOption>,
): IObservable<boolean> {
  return map$$(selectedOptions$, (options: IReadonlyOptionsSet<GOption>): boolean => {
    return options.has(option);
  });
}
