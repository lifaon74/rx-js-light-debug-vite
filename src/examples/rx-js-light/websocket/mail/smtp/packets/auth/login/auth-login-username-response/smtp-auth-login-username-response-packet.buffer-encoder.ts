import { u32 } from '@lifaon/number-types';
import { ISMTP$AUTH_LOGIN_USERNAME_RESPONSE$Packet } from './smtp-auth-login-username-response-packet.type';
import { base64BufferEncoder } from '../../../../../../array-buffer/base64/base64.buffer-encoder';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';


export function smtp$AUTH_LOGIN_USERNAME_RESPONSE$PacketBufferEncoder(
  {
    username,
  }: ISMTP$AUTH_LOGIN_USERNAME_RESPONSE$Packet,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = base64BufferEncoder(username.chars, buffer, index);

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}
