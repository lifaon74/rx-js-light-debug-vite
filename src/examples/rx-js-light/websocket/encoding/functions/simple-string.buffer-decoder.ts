import { u32, u8 } from '@lifaon/number-types';
import { ASCIIString } from '../../mail/classes/ascii-string/ascii-string.class';
import { IBufferDecoderResult } from '../types/buffer-decoder/buffer-decoder.type';
import { createNotEnoughDataError } from '../../errors/not-enough-data/not-enough-data-error';

export interface IIsAllowedCharFunction {
  (
    byte: u8,
  ): boolean;
}

export function simpleStringBufferDecoderWithThrowIfEndIsReached(
  isAllowedChar: IIsAllowedCharFunction,
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  const start: number = index;
  while (index < buffer.length) {
    const byte: u8 = buffer[index];
    if (isAllowedChar(byte)) {
      index++;
    } else {
      return [
        index,
        ASCIIString.fromSafeBuffer(buffer.subarray(start, index)),
      ];
    }
  }
  throw createNotEnoughDataError();
}

export function simpleStringBufferDecoder(
  isAllowedChar: IIsAllowedCharFunction,
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  const start: number = index;
  while (
    (index < buffer.length)
    && isAllowedChar(buffer[index])
    ) {
    index++;
  }
  return [
    index,
    ASCIIString.fromSafeBuffer(buffer.subarray(start, index)),
  ];
}
