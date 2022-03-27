import { u8 } from '@lifaon/number-types';
import { isNumericChar } from './is-numeric-char';
import { isAlphaChar } from './is-alpha-char';

export function isAlphaNumericChar(
  char: u8,
): boolean {
  return isAlphaChar(char)
    || isNumericChar(char);
}
