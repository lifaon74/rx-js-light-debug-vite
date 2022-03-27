import { u32 } from '@lifaon/number-types';
import { isHTTPWhiteSpaceChar } from '../../../../chars/is/http/is-http-white-space-char';

export function skipHTTPWhiteSpaces(
  buffer: Uint8Array,
  index: u32,
): u32 {
  while (
    (index < buffer.length)
    && isHTTPWhiteSpaceChar(buffer[index])
    ) {
    index++;
  }
  return index;
}
