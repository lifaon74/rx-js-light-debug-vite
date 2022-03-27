import { u32, u8 } from '@lifaon/number-types';
import { simpleStringBufferDecoderWithThrowIfEndIsReached } from '../../../encoding/functions/simple-string.buffer-decoder';
import { ASCIIString } from '../../classes/ascii-string/ascii-string.class';
import { IBufferDecoderResult } from '../../../encoding/types/buffer-decoder/buffer-decoder.type';

export function smtp$TextString$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  return simpleStringBufferDecoderWithThrowIfEndIsReached(
    isSMTP$TextString$Char,
    buffer,
    index,
  );
}

function isSMTP$TextString$Char(
  byte: u8,
): boolean {
  return (byte === 9)
    || ((32 <= byte) && (byte <= 126));
}


