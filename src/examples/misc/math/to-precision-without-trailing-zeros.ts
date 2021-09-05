

export function toPrecisionWithoutTrailingZeros(
  value: number,
  precision: number,
): string {
  return Number(value.toPrecision(precision)).toString(10);
}


