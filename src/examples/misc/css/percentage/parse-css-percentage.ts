import { parseCSSNumber } from '../number/parse-css-number';

// https://developer.mozilla.org/en-US/docs/Web/CSS/percentage

export function parseCSSPercentage(
  input: string,
): number | null {
  return input.endsWith('%')
    ? parseCSSNumber(input.slice(0, -1))
    : null;
}
