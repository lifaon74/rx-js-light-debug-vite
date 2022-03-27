import { u8 } from '@lifaon/number-types';

export function isAlphaLowerChar(
  char: u8,
): boolean {
  return ((0x61 <= char) && (char <= 0x7a));
}
