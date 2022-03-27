import { u32 } from '@lifaon/number-types';
import { ISMTP$AUTH_LOGIN_PASSWORD_RESPONSE$Packet } from './smtp-auth-login-password-response-packet.type';
import { base64BufferEncoder } from '../../../../../../array-buffer/base64/base64.buffer-encoder';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';


export function smtp$AUTH_LOGIN_PASSWORD_RESPONSE$PacketBufferEncoder(
  {
    password,
  }: ISMTP$AUTH_LOGIN_PASSWORD_RESPONSE$Packet,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = base64BufferEncoder(password.chars, buffer, index);

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}
