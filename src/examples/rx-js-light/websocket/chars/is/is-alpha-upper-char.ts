import { u8 } from '@lifaon/number-types';

export function isAlphaUpperChar(
  char: u8,
): boolean {
  return ((0x41 <= char) && (char <= 0x5a));
}
