import { u32 } from '@lifaon/number-types';
import { CHAR_L } from '../../../../chars/alpha/uppercase/L.constant';
import { CHAR_O } from '../../../../chars/alpha/uppercase/O.constant';
import { CHAR_SPACE } from '../../../../chars/space.constant';
import { CHAR_A } from '../../../../chars/alpha/uppercase/A.constant';
import { CHAR_R } from '../../../../chars/alpha/uppercase/R.constant';
import { CHAR_F } from '../../../../chars/alpha/uppercase/F.constant';
import { CHAR_I } from '../../../../chars/alpha/uppercase/I.constant';
import { CHAR_M } from '../../../../chars/alpha/uppercase/M.constant';
import { CHAR_COLON } from '../../../../chars/colon.constant';
import { crlfBufferEncoder } from '../../../../encoding/functions/crlf.buffer-encoder';
import { uint8ArrayBufferEncoder } from '../../../../array-buffer/uint8-array.buffer-encoder';
import { ISMTP$MAIL_FROM$Packet } from './smtp-mail-from-packet.type';
import { ensureUint8ArrayHasEnoughSpace } from '../../../../array-buffer/ensure-uint8-array-has-enough-space';
import { CHAR_LOWER_THAN } from '../../../../chars/lower-than-sign.constant';
import {
  smtpDataContentHeader$EmailAddress$BufferEncoder,
} from '../data/data-content/headers/address/smtp-data-content-header-email-address.buffer-encoder';
import { CHAR_GREATER_THAN } from '../../../../chars/greater-than-sign.constant';

// https://datatracker.ietf.org/doc/html/rfc5321#section-3.3
// https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.1.2
// https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2 => reverse path

// TODO mail parameters

const MAIL_FROM_CHARS = new Uint8Array([
  CHAR_M,
  CHAR_A,
  CHAR_I,
  CHAR_L,
  CHAR_SPACE,
  CHAR_F,
  CHAR_R,
  CHAR_O,
  CHAR_M,
  CHAR_COLON,
  CHAR_LOWER_THAN,
]);


export function smtp$MAIL_FROM$PacketBufferEncoder(
  {
    from,
  }: ISMTP$MAIL_FROM$Packet,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    MAIL_FROM_CHARS,
    buffer,
    index,
  );

  index = smtpDataContentHeader$EmailAddress$BufferEncoder(
    from,
    buffer,
    index,
  );

  ensureUint8ArrayHasEnoughSpace(
    buffer,
    index,
    1, // >
  );

  buffer[index++] = CHAR_GREATER_THAN;

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}


