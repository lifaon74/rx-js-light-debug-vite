import { u32, u8 } from '@lifaon/number-types';
import { createExpectedByteError } from '../../errors/expected-byte/expected-byte-error';
import { createNotEnoughDataError } from '../../errors/not-enough-data/not-enough-data-error';
import { IBufferDecoderResult } from '../types/buffer-decoder/buffer-decoder.type';


export function bufferDecoderExpects(
  data: ArrayLike<u8>,
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<void> {
  if (buffer.length >= (index + data.length)) {
    for (let i = 0; i < data.length; i++) {
      const byte: u8 = buffer[index++];
      if (byte !== data[i]) {
        throw createExpectedByteError(data[i], byte);
      }
    }
    return [
      index,
      void 0,
    ];
  } else {
    throw createNotEnoughDataError();
  }
}
