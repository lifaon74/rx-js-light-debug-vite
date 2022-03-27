import { MessageId } from '../../../../../../classes/message-id/message-id.class';
import { u32 } from '@lifaon/number-types';
import { asciiStringBufferEncoder } from '../../../../../../classes/ascii-string/functions/helpers/ascii-string.buffer-encoder';
import { ensureUint8ArrayHasEnoughSpace } from '../../../../../../../array-buffer/ensure-uint8-array-has-enough-space';
import { CHAR_AT_SIGN } from '../../../../../../../chars/at-sign.constant';
import { CHAR_LOWER_THAN } from '../../../../../../../chars/lower-than-sign.constant';
import { CHAR_GREATER_THAN } from '../../../../../../../chars/greater-than-sign.constant';

export function smtpDataContentHeader$MessageIdClass$BufferEncoder(
  messageId: MessageId,
  buffer: Uint8Array,
  index: u32,
): u32 {
  ensureUint8ArrayHasEnoughSpace(
    buffer,
    index,
    1, // <
  );

  buffer[index++] = CHAR_LOWER_THAN;

  index = asciiStringBufferEncoder(
    messageId.left,
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
    messageId.right,
    buffer,
    index,
  );

  ensureUint8ArrayHasEnoughSpace(
    buffer,
    index,
    1, // >
  );

  buffer[index++] = CHAR_GREATER_THAN;

  return index;
}
