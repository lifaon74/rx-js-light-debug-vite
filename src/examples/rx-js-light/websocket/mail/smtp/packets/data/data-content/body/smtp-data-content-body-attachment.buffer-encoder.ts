import { u32 } from '@lifaon/number-types';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';
import { stringToUTF8EncodedStringBuffer } from '@lirx/core';
import { EmailAttachment } from '../../../../../classes/email-attachment/email-attachment.class';
import { asciiStringBufferEncoder } from '../../../../../classes/ascii-string/functions/helpers/ascii-string.buffer-encoder';
import { smtpDataContentBody$Base64$BufferEncoder } from './shared/smtp-data-content-body-base64.buffer-encoder';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';

const ATTACHMENT_BODY_PART_0 = stringToUTF8EncodedStringBuffer('Content-Type: ');
const ATTACHMENT_BODY_PART_1 = stringToUTF8EncodedStringBuffer('\r\nContent-Disposition: attachment; filename="');
const ATTACHMENT_BODY_PART_2 = stringToUTF8EncodedStringBuffer('"\r\nContent-Transfer-Encoding: base64\r\n\r\n');


export function smtpDataContentBody$Attachment$BufferEncoder(
  attachment: EmailAttachment,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    ATTACHMENT_BODY_PART_0,
    buffer,
    index,
  );

  index = asciiStringBufferEncoder(
    attachment.type,
    buffer,
    index,
  );

  index = uint8ArrayBufferEncoder(
    ATTACHMENT_BODY_PART_1,
    buffer,
    index,
  );

  index = asciiStringBufferEncoder(
    attachment.name,
    buffer,
    index,
  );

  index = uint8ArrayBufferEncoder(
    ATTACHMENT_BODY_PART_2,
    buffer,
    index,
  );

  index = smtpDataContentBody$Base64$BufferEncoder(
    attachment.content,
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}
