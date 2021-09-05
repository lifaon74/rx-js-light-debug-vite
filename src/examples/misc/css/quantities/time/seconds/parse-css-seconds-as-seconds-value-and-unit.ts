import { ISecondsValueAndUnit } from './seconds-value-and-unit.type';
import { createSecondsValueAndUnit } from './create-seconds-value-and-unit';
import { parseCSSSeconds } from './value/parse-css-seconds';

export function parseCSSSecondsAsSecondsValueAndUnit(
  input: string,
): ISecondsValueAndUnit | null {
  const value: number | null = parseCSSSeconds(input);
  return (value === null)
    ? null
    : createSecondsValueAndUnit(value);
}
