import { u32 } from '@lifaon/number-types';
import { throwNotEnoughSpaceError } from './errors/not-enough-space/not-enough-space-error';
import {
  BUFFER_DECODER_RESULT_NOT_ENOUGH_DATA
} from './encoding/types/buffer-decoder/result/not-enough-data/buffer-decoder-result-not-enough-data.constant';
import { IBufferDecoderResult } from './encoding/types/buffer-decoder/result/buffer-decoder-result.type';
import {
  createBufferDecoderResultDone
} from './encoding/types/buffer-decoder/result/done/create-buffer-decoder-result-done';


function subarray(
  buffer: Uint8Array,
  index: u32,
): Uint8Array {
  return (index === 0)
    ? buffer
    : buffer.subarray(index);
}


export function estimatestringToUTF8EncodedStringBufferBufferSize(
  input: string,
): u32 {
  return input.length * 2;
}

export function stringToUTF8EncodedStringBufferBufferEncoder(
  input: string,
  buffer: Uint8Array,
  index: u32,
): u32 {
  const { read, written }: TextEncoderEncodeIntoResult = new TextEncoder().encodeInto(
    input,
    subarray(buffer, index),
  );

  if (read === input.length) {
    return index + (written as u32);
  } else {
    throwNotEnoughSpaceError();
  }
}


export function utf8EncodedStringToStringBufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<string> {
  try {
    return createBufferDecoderResultDone<string>(
      new TextDecoder('utf-8', { fatal: true }).decode(subarray(buffer, index)),
      buffer.length,
    );
  } catch {
    return BUFFER_DECODER_RESULT_NOT_ENOUGH_DATA;
  }
}



