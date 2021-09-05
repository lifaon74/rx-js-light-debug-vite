import { parseCSSNumber } from '../../../../../number/parse-css-number';

// https://developer.mozilla.org/en-US/docs/Web/CSS/angle

export function parseCSSRadians(
  input: string,
): number | null {
  return input.endsWith('rad')
    ? parseCSSNumber(input.slice(0, -3))
    : null;
}


