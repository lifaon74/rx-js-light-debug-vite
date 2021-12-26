import { readSelectedOptionsObservableValue } from './read-selected-options-observable-value';
import { readMultipleObservableValue } from './read-multiple-observable-value';
import { toggleOptionSelect } from './toggle-option-select';
import { IObservable, IObserver } from '@lifaon/rx-js-light';
import { IReadonlyOptionsSet } from './types/readonly-options-set.type';
import { IOptionsList } from './types/options-list.type';

export interface IToggleOptionSelectWithResolversOptions<GOption> {
  readonly multiple$: IObservable<boolean>;
  readonly selectedOptions$: IObservable<IReadonlyOptionsSet<GOption>>;
  readonly $rawSelectedOptions: IObserver<IOptionsList<GOption>>;
  readonly option: GOption;
  readonly select?: boolean;
}

export function toggleOptionSelectWithResolvers<GOption>(
  {
    multiple$,
    selectedOptions$,
    $rawSelectedOptions,
    option,
    select,
  }: IToggleOptionSelectWithResolversOptions<GOption>,
): boolean {
  const selectedOptions: Set<GOption> = readSelectedOptionsObservableValue(selectedOptions$) as Set<GOption>;

  const changed: boolean = toggleOptionSelect<GOption>({
    multiple: readMultipleObservableValue(multiple$),
    selectedOptions,
    option,
    select,
  });

  if (changed) {
    $rawSelectedOptions(selectedOptions);
  }
  return changed;
}
