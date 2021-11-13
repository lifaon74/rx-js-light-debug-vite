export interface ISelectOptionOptions<GOption> {
  readonly multiple: boolean;
  readonly selectedOptions: Set<GOption>;
  readonly option: GOption;
}

export function selectOption<GOption>(
  {
    multiple,
    selectedOptions,
    option,
  }: ISelectOptionOptions<GOption>,
): boolean {
  if (selectedOptions.has(option)) {
    return false;
  } else {
    if (!multiple) {
      selectedOptions.clear();
    }
    selectedOptions.add(option);
    return true;
  }
}
