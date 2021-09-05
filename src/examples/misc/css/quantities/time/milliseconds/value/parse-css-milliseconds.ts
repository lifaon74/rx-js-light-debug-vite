import { parseCSSNumber } from '../../../../number/parse-css-number';

// https://developer.mozilla.org/en-US/docs/Web/CSS/time

export function parseCSSMilliseconds(
  input: string,
): number | null {
  return input.endsWith('ms')
    ? parseCSSNumber(input.slice(0, -2))
    : null;
}
