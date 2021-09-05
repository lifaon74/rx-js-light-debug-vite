import { IMillisecondsValueAndUnit } from './milliseconds-value-and-unit.type';
import { parseCSSMilliseconds } from './value/parse-css-milliseconds';
import { createMillisecondsValueAndUnit } from './create-milliseconds-value-and-unit';


export function parseCSSMillisecondsAsMillisecondsValueAndUnit(
  input: string,
): IMillisecondsValueAndUnit | null {
  const value: number | null = parseCSSMilliseconds(input);
  return (value === null)
    ? null
    : createMillisecondsValueAndUnit(value);
}
