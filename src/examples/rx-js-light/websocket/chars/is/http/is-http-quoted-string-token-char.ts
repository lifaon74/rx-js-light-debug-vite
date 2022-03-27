import { u8 } from '@lifaon/number-types';

export function isHTTPQuotedStringTokenChar(
  byte: u8,
): boolean {
  return (
    (byte === 0x09) // \t
    || ((0x20 <= byte /* SP */) && (byte <= 0x7e)) // ~
    || ((0x80 <= byte) && (byte <= 0xff)) // ÿ
  );
}
