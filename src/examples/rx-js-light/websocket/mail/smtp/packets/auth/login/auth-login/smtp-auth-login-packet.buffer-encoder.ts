import { u32 } from '@lifaon/number-types';
import { ISMTP$AUT_LOGINH$Packet } from './smtp-auth-login-packet.type';
import { CHAR_A } from '../../../../../../chars/alpha/uppercase/A.constant';
import { CHAR_U } from '../../../../../../chars/alpha/uppercase/U.constant';
import { CHAR_T } from '../../../../../../chars/alpha/uppercase/T.constant';
import { CHAR_H } from '../../../../../../chars/alpha/uppercase/H.constant';
import { CHAR_SPACE } from '../../../../../../chars/space.constant';
import { CHAR_L } from '../../../../../../chars/alpha/uppercase/L.constant';
import { CHAR_O } from '../../../../../../chars/alpha/uppercase/O.constant';
import { CHAR_G } from '../../../../../../chars/alpha/uppercase/G.constant';
import { CHAR_I } from '../../../../../../chars/alpha/uppercase/I.constant';
import { CHAR_N } from '../../../../../../chars/alpha/uppercase/N.constant';
import { asciiStringBufferEncoder } from '../../../../../classes/ascii-string/functions/helpers/ascii-string.buffer-encoder';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';
import { ensureUint8ArrayHasEnoughSpace } from '../../../../../../array-buffer/ensure-uint8-array-has-enough-space';
import { CHAR_GREATER_THAN } from '../../../../../../chars/greater-than-sign.constant';

// https://datatracker.ietf.org/doc/html/rfc4954
// https://interoperability.blob.core.windows.net/files/MS-XLOGIN/%5BMS-XLOGIN%5D.pdf   => p.8

const AUTH_LOGIN_CHARS = new Uint8Array([
  CHAR_A,
  CHAR_U,
  CHAR_T,
  CHAR_H,
  CHAR_SPACE,
  CHAR_L,
  CHAR_O,
  CHAR_G,
  CHAR_I,
  CHAR_N,
]);

export function smtp$AUTH_LOGIN$PacketBufferEncoder(
  {
    username,
  }: ISMTP$AUT_LOGINH$Packet,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    AUTH_LOGIN_CHARS,
    buffer,
    index,
  );

  if (username !== void 0) {
    ensureUint8ArrayHasEnoughSpace(
      buffer,
      index,
      1, // SP
    );

    buffer[index++] = CHAR_SPACE;

    index = asciiStringBufferEncoder(
      username,
      buffer,
      index,
    );
  }

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}
