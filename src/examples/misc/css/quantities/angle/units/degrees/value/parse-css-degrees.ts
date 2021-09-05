import { parseCSSNumber } from '../../../../../number/parse-css-number';

// https://developer.mozilla.org/en-US/docs/Web/CSS/angle

export function parseCSSDegrees(
  input: string,
): number | null {
  return input.endsWith('deg')
    ? parseCSSNumber(input.slice(0, -3))
    : null;
}


