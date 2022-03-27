import { EmailContact } from '../../../../../../classes/email-contact/email-contact.class';
import { asciiStringBufferEncoder } from '../../../../../../classes/ascii-string/functions/helpers/ascii-string.buffer-encoder';
import { CHAR_GREATER_THAN } from '../../../../../../../chars/greater-than-sign.constant';
import { ensureUint8ArrayHasEnoughSpace } from '../../../../../../../array-buffer/ensure-uint8-array-has-enough-space';
import { u32 } from '@lifaon/number-types';
import {
  smtpDataContentHeader$EmailAddress$BufferEncoder
} from './smtp-data-content-header-email-address.buffer-encoder';
import { CHAR_SPACE } from '../../../../../../../chars/space.constant';
import { CHAR_LOWER_THAN } from '../../../../../../../chars/lower-than-sign.constant';

export function smtpDataContentHeader$EmailContact$BufferEncoder(
  contact: EmailContact,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = asciiStringBufferEncoder(
    contact.name,
    buffer,
    index,
  );

  ensureUint8ArrayHasEnoughSpace(
    buffer,
    index,
    2, // " <"
  );

  buffer[index++] = CHAR_SPACE;
  buffer[index++] = CHAR_LOWER_THAN;

  index = smtpDataContentHeader$EmailAddress$BufferEncoder(
    contact.address,
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
