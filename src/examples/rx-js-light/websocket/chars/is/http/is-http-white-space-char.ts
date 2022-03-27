import { u8 } from '@lifaon/number-types';
import { CHAR_SPACE } from '../../space.constant';
import { CHAR_HT } from '../../HT.constant';
import { CHAR_CR } from '../../CR.constant';
import { CHAR_LF } from '../../LF.constant';

export function isHTTPWhiteSpaceChar(
  byte: u8,
): boolean {
  return (
    (byte === CHAR_SPACE)
    || (byte === CHAR_HT)
    || (byte === CHAR_CR)
    || (byte === CHAR_LF)
  );
}
