import { ASCIIString } from '../../../ascii-string.class';
import { isHTTPWhiteSpaceChar } from '../../../../../../chars/is/http/is-http-white-space-char';
import { u32, u8 } from '@lifaon/number-types';

export function getTrimEndIndexForASCIIString(
  input: ASCIIString,
): number {
  return getTrimEndIndexForUint8Array(input.chars, input.chars.length);
}

export function getTrimEndIndexForUint8Array(
  buffer: Uint8Array,
  index: u32,
): number {
  index--;
  while (
    (index >= 0)
    && isHTTPWhiteSpaceChar(buffer[index])
    ) {
    index--;
  }
  return index + 1;
}

