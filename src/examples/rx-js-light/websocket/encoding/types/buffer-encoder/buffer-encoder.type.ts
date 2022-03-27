import { u32 } from '@lifaon/number-types';

export interface IBufferEncoder<GValue> {
  (
    value: GValue,
    buffer: Uint8Array,
    index: u32,
  ): u32; // index at which the encoder stopped to write the data
}


