import { toPrecisionWithoutTrailingZeros } from '../../math/to-precision-without-trailing-zeros';


export function toPrecisionWithoutTrailingZerosForColorAlpha(
  value: number,
  precision: number,
): string {
  return (precision === 0)
    ? toPrecisionWithoutTrailingZeros(value, 3)
    : toPrecisionWithoutTrailingZeros(value, precision);
}


