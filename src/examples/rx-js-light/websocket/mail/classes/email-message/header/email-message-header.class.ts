import { u32 } from '@lifaon/number-types';


export abstract class EmailMessageHeader {
  abstract encodeInBuffer(
    buffer: Uint8Array,
    index: u32,
  ): u32;
}



