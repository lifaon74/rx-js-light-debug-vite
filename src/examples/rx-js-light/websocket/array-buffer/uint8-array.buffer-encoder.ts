import { u32 } from '@lifaon/number-types';
import { ensureUint8ArrayHasEnoughSpace } from './ensure-uint8-array-has-enough-space';

export function uint8ArrayBufferEncoder(
  data: Uint8Array,
  buffer: Uint8Array,
  index: u32,
): u32 {
  ensureUint8ArrayHasEnoughSpace(
    buffer,
    index,
    data.length,
  );

  buffer.set(data, index);

  return index + data.length;
}

