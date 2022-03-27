import { u32 } from '@lifaon/number-types';
import { CHAR_COLON } from '../../../../../../chars/colon.constant';
import { CHAR_SPACE } from '../../../../../../chars/space.constant';
import { MessageId } from '../../../../../classes/message-id/message-id.class';
import { CHAR_MINUS } from '../../../../../../chars/minus.constant';
import { CHAR_D } from '../../../../../../chars/alpha/uppercase/D.constant';
import { CHAR_a } from '../../../../../../chars/alpha/lowercase/a.constant';
import { CHAR_e } from '../../../../../../chars/alpha/lowercase/e.constant';
import { CHAR_I } from '../../../../../../chars/alpha/uppercase/I.constant';
import { CHAR_M } from '../../../../../../chars/alpha/uppercase/M.constant';
import { CHAR_s } from '../../../../../../chars/alpha/lowercase/s.constant';
import { CHAR_g } from '../../../../../../chars/alpha/lowercase/g.constant';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';
import {
  smtpDataContentHeader$MessageIdClass$BufferEncoder,
} from './message-id/smtp-data-content-header-message-id-class.buffer-encoder';


const MESSAGE_ID_HEADER_NAME = new Uint8Array([
  CHAR_M,
  CHAR_e,
  CHAR_s,
  CHAR_s,
  CHAR_a,
  CHAR_g,
  CHAR_e,
  CHAR_MINUS,
  CHAR_I,
  CHAR_D,
  CHAR_COLON,
  CHAR_SPACE,
]);

export function smtpDataContentHeader$MessageId$BufferEncoder(
  messageId: MessageId,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    MESSAGE_ID_HEADER_NAME,
    buffer,
    index,
  );

  index = smtpDataContentHeader$MessageIdClass$BufferEncoder(
    messageId,
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}


