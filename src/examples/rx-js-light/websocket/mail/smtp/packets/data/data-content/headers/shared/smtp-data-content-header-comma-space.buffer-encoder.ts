import { ensureUint8ArrayHasEnoughSpace } from '../../../../../../../array-buffer/ensure-uint8-array-has-enough-space';
import { CHAR_COMMA } from '../../../../../../../chars/comma.constant';
import { CHAR_CR } from '../../../../../../../chars/CR.constant';
import { CHAR_LF } from '../../../../../../../chars/LF.constant';
import { CHAR_SPACE } from '../../../../../../../chars/space.constant';
import { u32 } from '@lifaon/number-types';
import { IBufferEncoder } from '../../../../../../../encoding/types/buffer-encoder/buffer-encoder.type';

export function smtpDataContentHeader$CommaSpaceList$BufferEncoder<GValue>(
  list: ArrayLike<GValue>,
  encoder: IBufferEncoder<GValue>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  for (let i = 0, l = list.length; i < l; i++) {
    if (i > 0) {
      index = smtpDataContentHeader$CommaSpace$BufferEncoderSplit(
        buffer,
        index,
      );
    }

    index = encoder(
      list[i],
      buffer,
      index,
    );
  }

  return index;
}

export function smtpDataContentHeader$CommaSpace$BufferEncoder(
  buffer: Uint8Array,
  index: u32,
  splitOnWhiteSpace: boolean = true,
): u32 {
  return splitOnWhiteSpace
    ? smtpDataContentHeader$CommaSpace$BufferEncoderSplit(buffer, index)
    : smtpDataContentHeader$CommaSpace$BufferEncoderRaw(buffer, index);
}

export function smtpDataContentHeader$CommaSpace$BufferEncoderRaw(
  buffer: Uint8Array,
  index: u32,
): u32 {
  ensureUint8ArrayHasEnoughSpace(
    buffer,
    index,
    2, // "," SP
  );
  buffer[index++] = CHAR_COMMA;
  buffer[index++] = CHAR_SPACE;

  return index;
}

export function smtpDataContentHeader$CommaSpace$BufferEncoderSplit(
  buffer: Uint8Array,
  index: u32,
): u32 {
  ensureUint8ArrayHasEnoughSpace(
    buffer,
    index,
    4, // "," CRLF SP
  );

  buffer[index++] = CHAR_COMMA;
  buffer[index++] = CHAR_CR;
  buffer[index++] = CHAR_LF;
  buffer[index++] = CHAR_SPACE;

  return index;
}

