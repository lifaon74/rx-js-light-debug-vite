import { parseCSSNumber } from '../number/parse-css-number';

// https://developer.mozilla.org/en-US/docs/Web/CSS/integer

export function parseCSSInteger(
  input: string,
): number | null {
  const value: number | null = parseCSSNumber(input);
  return ((value === null) || !Number.isSafeInteger(value))
    ? null
    : value;
}
