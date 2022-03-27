import { u32 } from '@lifaon/number-types';
import { ISMTP$EHLO$Packet } from './smtp-ehlo-packet.type';
import { CHAR_E } from '../../../../chars/alpha/uppercase/E.constant';
import { CHAR_H } from '../../../../chars/alpha/uppercase/H.constant';
import { CHAR_L } from '../../../../chars/alpha/uppercase/L.constant';
import { CHAR_O } from '../../../../chars/alpha/uppercase/O.constant';
import { asciiStringBufferEncoder } from '../../../classes/ascii-string/functions/helpers/ascii-string.buffer-encoder';
import { uint8ArrayBufferEncoder } from '../../../../array-buffer/uint8-array.buffer-encoder';
import { crlfBufferEncoder } from '../../../../encoding/functions/crlf.buffer-encoder';
import { CHAR_SPACE } from '../../../../chars/space.constant';

// https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.1.1

const EHLO_CHARS = new Uint8Array([
  CHAR_E,
  CHAR_H,
  CHAR_L,
  CHAR_O,
  CHAR_SPACE,
]);


export function smtp$EHLO$PacketBufferEncoder(
  {
    domain,
  }: ISMTP$EHLO$Packet,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    EHLO_CHARS,
    buffer,
    index,
  );

  index = asciiStringBufferEncoder(
    domain.value,
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}
