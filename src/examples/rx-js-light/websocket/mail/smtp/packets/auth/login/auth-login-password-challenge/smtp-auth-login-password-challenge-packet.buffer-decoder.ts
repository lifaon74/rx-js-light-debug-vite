import { u32 } from '@lifaon/number-types';
import { CHAR_CR } from '../../../../../../chars/CR.constant';
import { CHAR_LF } from '../../../../../../chars/LF.constant';
import { bufferDecoderExpects } from '../../../../../../encoding/functions/buffer-decoder-expects';
import { IBufferDecoderResult } from '../../../../../../encoding/types/buffer-decoder/buffer-decoder.type';

// const AUTH_LOGIN_PASSWORD_CHALLENGE_EXPECTED_CHARS = binaryStringToUint8Array('334 UGFzc3dvcmQ6');
const AUTH_LOGIN_PASSWORD_CHALLENGE_EXPECTED_CHARS = new Uint8Array([51, 51, 52, 32, 85, 71, 70, 122, 99, 51, 100, 118, 99, 109, 81, 54, CHAR_CR, CHAR_LF]);

export function smtp$AUTH_LOGIN_PASSWORD_CHALLENGE$PacketBufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<void> {
  return bufferDecoderExpects(
    AUTH_LOGIN_PASSWORD_CHALLENGE_EXPECTED_CHARS,
    buffer,
    index,
  );
}


