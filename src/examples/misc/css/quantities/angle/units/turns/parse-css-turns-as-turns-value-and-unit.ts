import { ITurnsValueAndUnit } from './turns-value-and-unit.type';
import { createTurnsValueAndUnit } from './create-turns-value-and-unit';
import { parseCSSTurns } from './value/parse-css-turns';

export function parseCSSTurnsAsTurnsValueAndUnit(
  input: string,
): ITurnsValueAndUnit | null {
  const value: number | null = parseCSSTurns(input);
  return (value === null)
    ? null
    : createTurnsValueAndUnit(value);
}
