import { u8 } from '@lifaon/number-types';
import { isAlphaNumericChar } from '../is-alpha-numeric-char';

export function isHTTPTokenChar(
  byte: u8,
): boolean {
  return (
    isAlphaNumericChar(byte)
    || (byte === 0x21) // !
    || (byte === 0x23) // #
    || (byte === 0x24) // $
    || (byte === 0x25) // %
    || (byte === 0x26) // &
    || (byte === 0x27) // '
    || (byte === 0x2a) // *
    || (byte === 0x2b) // +
    || (byte === 0x2d) // -
    || (byte === 0x2e) // .
    || (byte === 0x5e) // ^
    || (byte === 0x5f) // _
    || (byte === 0x60) // `
    || (byte === 0x7c) // |
    || (byte === 0x7e) // ~
  );
}
