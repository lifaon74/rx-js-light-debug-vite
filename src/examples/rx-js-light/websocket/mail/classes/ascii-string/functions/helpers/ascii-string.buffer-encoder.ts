import { u32 } from '@lifaon/number-types';
import { ASCIIString } from '../../ascii-string.class';
import { uint8ArrayBufferEncoder } from '../../../../../array-buffer/uint8-array.buffer-encoder';

export function asciiStringBufferEncoder(
  str: ASCIIString,
  buffer: Uint8Array,
  index: u32,
): u32 {
  return uint8ArrayBufferEncoder(
    str.chars,
    buffer,
    index,
  );
}

