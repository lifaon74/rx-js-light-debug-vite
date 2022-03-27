import { u32 } from '@lifaon/number-types';

export interface IStaticBufferEncoder {
  (
    buffer: Uint8Array,
    index: u32,
  ): u32;
}
