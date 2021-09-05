import { parseCSSNumber } from '../../../../number/parse-css-number';

// https://developer.mozilla.org/en-US/docs/Web/CSS/time

export function parseCSSSeconds(
  input: string,
): number | null {
  return input.endsWith('s')
    ? parseCSSNumber(input.slice(0, -1))
    : null;
}


