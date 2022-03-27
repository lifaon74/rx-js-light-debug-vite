import { ASCIIString } from '../../../ascii-string.class';
import { isHTTPWhiteSpaceChar } from '../../../../../../chars/is/http/is-http-white-space-char';
import { u32, u8 } from '@lifaon/number-types';

export function getTrimStartIndexForASCIIString(
  input: ASCIIString,
): number {
  return getTrimStartIndexForUint8Array(input.chars, 0);
}

export function getTrimStartIndexForUint8Array(
  buffer: Uint8Array,
  index: u32,
): number {
  while (
    (index < buffer.length)
    && isHTTPWhiteSpaceChar(buffer[index])
    ) {
    index++;
  }
  return index;
}

