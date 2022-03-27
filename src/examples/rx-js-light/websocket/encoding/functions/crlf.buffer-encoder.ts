import { u32 } from '@lifaon/number-types';
import { ensureUint8ArrayHasEnoughSpace } from '../../array-buffer/ensure-uint8-array-has-enough-space';
import { CHAR_CR } from '../../chars/CR.constant';
import { CHAR_LF } from '../../chars/LF.constant';

export function crlfBufferEncoder(
  buffer: Uint8Array,
  index: u32,
): u32 {
  ensureUint8ArrayHasEnoughSpace(
    buffer,
    index,
    2, // CRLF
  );

  buffer[index++] = CHAR_CR;
  buffer[index++] = CHAR_LF;

  return index;
}

