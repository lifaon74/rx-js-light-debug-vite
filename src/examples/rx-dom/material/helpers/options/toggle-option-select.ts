import { deselectOption } from './deselect-option';
import { selectOption } from './select-option';


export interface IToggleOptionSelectOptions<GOption> {
  readonly multiple: boolean;
  readonly selectedOptions: Set<GOption>;
  readonly option: GOption;
  readonly select?: boolean;
}

export function toggleOptionSelect<GOption>(
  {
    multiple,
    selectedOptions,
    option,
    select = !selectedOptions.has(option),
  }: IToggleOptionSelectOptions<GOption>,
): boolean {
  return select
    ? selectOption<GOption>({
      multiple,
      selectedOptions,
      option,
    })
    : deselectOption<GOption>({
      allowNoOptions: multiple,
      selectedOptions,
      option,
    });
}




