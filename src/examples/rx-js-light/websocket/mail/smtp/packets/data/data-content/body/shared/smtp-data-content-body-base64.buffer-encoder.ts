import { u32 } from '@lifaon/number-types';
import { base64BufferEncoder } from '../../../../../../../array-buffer/base64/base64.buffer-encoder';
import { crlfBufferEncoder } from '../../../../../../../encoding/functions/crlf.buffer-encoder';

const SPLIT_SIZE = 57;

export function smtpDataContentBody$Base64$BufferEncoder(
  data: Uint8Array,
  buffer: Uint8Array,
  index: u32,
): u32 {
  let i: number = 0;

  while ((data.length - i) > SPLIT_SIZE) {
    index = base64BufferEncoder(data.subarray(i, i + SPLIT_SIZE), buffer, index);

    index = crlfBufferEncoder(
      buffer,
      index,
    );

    i += SPLIT_SIZE;
  }

  index = base64BufferEncoder(data.subarray(i), buffer, index);

  return index;
}
