import { u8 } from '@lifaon/number-types';

export function isNumericChar(
  char: u8,
): boolean {
  return ((0x30 <= char) && (char <= 0x39));
}
