import { IDegreesValueAndUnit } from './degrees-value-and-unit.type';
import { createDegreesValueAndUnit } from './create-degrees-value-and-unit';
import { parseCSSDegrees } from './value/parse-css-degrees';

export function parseCSSDegreesAsDegreesValueAndUnit(
  input: string,
): IDegreesValueAndUnit | null {
  const value: number | null = parseCSSDegrees(input);
  return (value === null)
    ? null
    : createDegreesValueAndUnit(value);
}
