
export function toHex(
  value: number,
  length: number,
): string {
  return value.toString(16).padStart(length, '0');
}

