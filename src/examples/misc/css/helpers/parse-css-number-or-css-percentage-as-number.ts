import { parseCSSNumber } from '../number/parse-css-number';
import { parseCSSPercentage } from '../percentage/parse-css-percentage';

export function parseCSSNumberOrCSSPercentageAsNumber(
  input: string,
  max: number,
): number | null {
  let value: number | null;
  if ((value = parseCSSNumber(input)) !== null) {
    return value;
  } else if ((value = parseCSSPercentage(input)) !== null) {
    return (value * max) / 100;
  } else {
    return null;
  }
}
