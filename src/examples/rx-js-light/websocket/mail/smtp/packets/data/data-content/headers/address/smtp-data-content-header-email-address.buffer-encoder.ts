import { EmailAddress } from '../../../../../../classes/email-address/email-address.class';
import { ensureUint8ArrayHasEnoughSpace } from '../../../../../../../array-buffer/ensure-uint8-array-has-enough-space';
import { CHAR_AT_SIGN } from '../../../../../../../chars/at-sign.constant';
import { u32 } from '@lifaon/number-types';
import { asciiStringBufferEncoder } from '../../../../../../classes/ascii-string/functions/helpers/ascii-string.buffer-encoder';

export function smtpDataContentHeader$EmailAddress$BufferEncoder(
  address: EmailAddress,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = asciiStringBufferEncoder(
    address.localpart,
    buffer,
    index,
  );

  ensureUint8ArrayHasEnoughSpace(
    buffer,
    index,
    1, // @
  );

  buffer[index++] = CHAR_AT_SIGN;

  index = asciiStringBufferEncoder(
    address.domain.value,
    buffer,
    index,
  );

  return index;
}
