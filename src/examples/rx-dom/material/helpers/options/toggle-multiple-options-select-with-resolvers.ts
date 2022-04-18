import { readSelectedOptionsObservableValue } from './read-selected-options-observable-value';
import { readMultipleObservableValue } from './read-multiple-observable-value';
import { toggleOptionSelect } from './toggle-option-select';
import { IObservable, IObserver } from '@lirx/core';
import { IReadonlyOptionsSet } from './types/readonly-options-set.type';
import { IOptionsList } from './types/options-list.type';

export interface IToggleMultipleOptionsSelectWithResolversOptions<GOption> {
  readonly multiple$: IObservable<boolean>;
  readonly selectedOptions$: IObservable<IReadonlyOptionsSet<GOption>>;
  readonly $rawSelectedOptions: IObserver<IOptionsList<GOption>>;
  readonly options: ArrayLike<GOption>;
  readonly select?: boolean;
}

export function toggleMultipleOptionsSelectWithResolvers<GOption>(
  {
    multiple$,
    selectedOptions$,
    $rawSelectedOptions,
    options,
    select,
  }: IToggleMultipleOptionsSelectWithResolversOptions<GOption>,
): boolean {
  const selectedOptions: Set<GOption> = readSelectedOptionsObservableValue(selectedOptions$) as Set<GOption>;

  let changed: boolean = false;
  for (let i = 0, l = options.length; i < l; i++) {
    changed = toggleOptionSelect<GOption>({
      multiple: readMultipleObservableValue(multiple$),
      selectedOptions,
      option: options[i],
      select,
    }) || changed;
  }

  if (changed) {
    $rawSelectedOptions(selectedOptions);
  }

  return changed;
}
