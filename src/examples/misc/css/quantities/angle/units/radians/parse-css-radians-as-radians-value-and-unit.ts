import { IRadiansValueAndUnit } from './radians-value-and-unit.type';
import { createRadiansValueAndUnit } from './create-radians-value-and-unit';
import { parseCSSRadians } from './value/parse-css-radians';

export function parseCSSRadiansAsRadiansValueAndUnit(
  input: string,
): IRadiansValueAndUnit | null {
  const value: number | null = parseCSSRadians(input);
  return (value === null)
    ? null
    : createRadiansValueAndUnit(value);
}
