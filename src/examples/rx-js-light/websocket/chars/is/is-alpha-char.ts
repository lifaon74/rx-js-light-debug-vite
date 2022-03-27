import { u8 } from '@lifaon/number-types';
import { isAlphaLowerChar } from './is-alpha-lower-char';
import { isAlphaUpperChar } from './is-alpha-upper-char';

export function isAlphaChar(
  char: u8,
): boolean {
  return isAlphaLowerChar(char)
    || isAlphaUpperChar(char);
}
