import { u32 } from '@lifaon/number-types';

export interface IBufferDecoder<GValue> {
  (
    buffer: Uint8Array,
    index: u32,
  ): IBufferDecoderResult<GValue>;
}

export type IBufferDecoderResult<GValue> = [
  index: u32,
  value: GValue,
];
