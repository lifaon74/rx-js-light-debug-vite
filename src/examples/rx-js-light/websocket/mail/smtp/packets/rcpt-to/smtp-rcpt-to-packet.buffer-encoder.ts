import { u32 } from '@lifaon/number-types';
import { ISMTP$RCPT_TO$Packet } from './smtp-rcpt-to-packet.type';
import { CHAR_O } from '../../../../chars/alpha/uppercase/O.constant';
import { CHAR_SPACE } from '../../../../chars/space.constant';
import { CHAR_R } from '../../../../chars/alpha/uppercase/R.constant';
import { CHAR_COLON } from '../../../../chars/colon.constant';
import { CHAR_C } from '../../../../chars/alpha/uppercase/C.constant';
import { CHAR_T } from '../../../../chars/alpha/uppercase/T.constant';
import { CHAR_P } from '../../../../chars/alpha/uppercase/P.constant';
import { uint8ArrayBufferEncoder } from '../../../../array-buffer/uint8-array.buffer-encoder';
import { crlfBufferEncoder } from '../../../../encoding/functions/crlf.buffer-encoder';
import {
  smtpDataContentHeader$EmailAddress$BufferEncoder,
} from '../data/data-content/headers/address/smtp-data-content-header-email-address.buffer-encoder';
import { ensureUint8ArrayHasEnoughSpace } from '../../../../array-buffer/ensure-uint8-array-has-enough-space';
import { CHAR_GREATER_THAN } from '../../../../chars/greater-than-sign.constant';
import { CHAR_LOWER_THAN } from '../../../../chars/lower-than-sign.constant';

// https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.1.3

// TODO rcpt parameters

const RCPT_TO_CHARS = new Uint8Array([
  CHAR_R,
  CHAR_C,
  CHAR_P,
  CHAR_T,
  CHAR_SPACE,
  CHAR_T,
  CHAR_O,
  CHAR_COLON,
  CHAR_LOWER_THAN,
]);


export function smtp$RCPT_TO$PacketBufferEncoder(
  {
    to,
  }: ISMTP$RCPT_TO$Packet,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    RCPT_TO_CHARS,
    buffer,
    index,
  );

  index = smtpDataContentHeader$EmailAddress$BufferEncoder(
    to,
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

