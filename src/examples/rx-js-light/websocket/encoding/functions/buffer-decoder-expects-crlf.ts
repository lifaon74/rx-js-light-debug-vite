import { u32 } from '@lifaon/number-types';
import { IBufferDecoderResult } from '../types/buffer-decoder/result/buffer-decoder-result.type';
import { CHAR_CR } from '../../chars/CR.constant';
import { CHAR_LF } from '../../chars/LF.constant';
import { bufferDecoderExpects } from './buffer-decoder-expects';

const CRLF = new Uint8Array([
  CHAR_CR,
  CHAR_LF,
]);

export function bufferDecoderExpectsCRLF(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<void> {
  return bufferDecoderExpects(
    CRLF,
    buffer,
    index,
  );
}
