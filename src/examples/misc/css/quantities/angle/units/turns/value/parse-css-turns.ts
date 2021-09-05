import { parseCSSNumber } from '../../../../../number/parse-css-number';

// https://developer.mozilla.org/en-US/docs/Web/CSS/angle

export function parseCSSTurns(
  input: string,
): number | null {
  return input.endsWith('turn')
    ? parseCSSNumber(input.slice(0, -4))
    : null;
}


