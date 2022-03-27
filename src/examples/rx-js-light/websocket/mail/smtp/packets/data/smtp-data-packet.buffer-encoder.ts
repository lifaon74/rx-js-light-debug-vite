import { u32 } from '@lifaon/number-types';
import { uint8ArrayBufferEncoder } from '../../../../array-buffer/uint8-array.buffer-encoder';
import { CHAR_D } from '../../../../chars/alpha/uppercase/D.constant';
import { CHAR_T } from '../../../../chars/alpha/uppercase/T.constant';
import { CHAR_A } from '../../../../chars/alpha/uppercase/A.constant';
import { CHAR_CR } from '../../../../chars/CR.constant';
import { CHAR_LF } from '../../../../chars/LF.constant';

// https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.1.4

const DATA_CHARS = new Uint8Array([
  CHAR_D,
  CHAR_A,
  CHAR_T,
  CHAR_A,
  CHAR_CR,
  CHAR_LF,
]);


export function smtp$DATA$PacketBufferEncoderRaw(
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    DATA_CHARS,
    buffer,
    index,
  );

  return index;
}

export function smtp$DATA$PacketBufferEncoder(
  _: any,
  buffer: Uint8Array,
  index: u32,
): u32 {
  return smtp$DATA$PacketBufferEncoderRaw(
    buffer,
    index,
  );
}
