import { IBufferDecoderResult } from '../../../encoding/types/buffer-decoder/buffer-decoder.type';
import { u32 } from '@lifaon/number-types';
import { CHAR_MINUS } from '../../../chars/minus.constant';
import { createExpectedOrBytesError } from '../../../errors/expected-byte/expected-byte-error';
import { bufferDecoderExpects } from '../../../encoding/functions/buffer-decoder-expects';
import { CHAR_SPACE } from '../../../chars/space.constant';


export function smtp$Code$BufferDecoder(
  code: Uint8Array,
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<boolean> {
  [index] = bufferDecoderExpects(
    code,
    buffer,
    index,
  );

  if (
    (buffer[index] === CHAR_SPACE)
    || (buffer[index] === CHAR_MINUS)
  ) {
    return [
      index + 1,
      (buffer[index] === CHAR_MINUS),
    ];
  } else {
    throw createExpectedOrBytesError([CHAR_SPACE, CHAR_MINUS], buffer[index]);
  }
}

