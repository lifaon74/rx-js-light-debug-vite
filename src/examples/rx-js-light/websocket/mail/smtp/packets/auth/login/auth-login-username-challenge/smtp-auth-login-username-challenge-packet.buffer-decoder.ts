import { u32 } from '@lifaon/number-types';
import { CHAR_CR } from '../../../../../../chars/CR.constant';
import { CHAR_LF } from '../../../../../../chars/LF.constant';

import { bufferDecoderExpects } from '../../../../../../encoding/functions/buffer-decoder-expects';
import { IBufferDecoderResult } from '../../../../../../encoding/types/buffer-decoder/buffer-decoder.type';

// const BYTES = binaryStringToUint8Array('334 VXNlcm5hbWU6');
const AUTH_LOGIN_USERNAME_CHALLENGE_EXPECTED_CHARS = new Uint8Array([51, 51, 52, 32, 86, 88, 78, 108, 99, 109, 53, 104, 98, 87, 85, 54, CHAR_CR, CHAR_LF]);

export function smtp$AUTH_LOGIN_USERNAME_CHALLENGE$PacketBufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<void> {
  return bufferDecoderExpects(
    AUTH_LOGIN_USERNAME_CHALLENGE_EXPECTED_CHARS,
    buffer,
    index,
  );
}
