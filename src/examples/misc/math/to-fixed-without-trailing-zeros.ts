

export function toFixedWithoutTrailingZeros(
  value: number,
  precision: number,
): string {
  return Number(value.toFixed(precision)).toString(10);
}


