export interface IDeselectOptionOptions<GOption> {
  readonly selectedOptions: Set<GOption>;
  readonly option: GOption;
  readonly allowNoOptions: boolean;
}

export function deselectOption<GOption>(
  {
    selectedOptions,
    option,
    allowNoOptions = false,
  }: IDeselectOptionOptions<GOption>,
): boolean {
  if (
    selectedOptions.has(option)
    && (
      allowNoOptions
      || (selectedOptions.size > 1)
    )
  ) {
    selectedOptions.delete(option);
    return true;
  } else {
    return false;
  }
}
