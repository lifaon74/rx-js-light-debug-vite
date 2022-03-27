import { u32 } from '@lifaon/number-types';
import { CHAR_COLON } from '../../../../../../chars/colon.constant';
import { CHAR_SPACE } from '../../../../../../chars/space.constant';
import { CHAR_R } from '../../../../../../chars/alpha/uppercase/R.constant';
import { CHAR_e } from '../../../../../../chars/alpha/lowercase/e.constant';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';
import { CHAR_n } from '../../../../../../chars/alpha/lowercase/n.constant';
import { MessageId } from '../../../../../classes/message-id/message-id.class';
import {
  smtpDataContentHeader$MessageIdList$BufferEncoder,
} from './message-id/smtp-data-content-header-message-id-list.buffer-encoder';
import { CHAR_r } from '../../../../../../chars/alpha/lowercase/r.constant';
import { CHAR_s } from '../../../../../../chars/alpha/lowercase/s.constant';
import { CHAR_c } from '../../../../../../chars/alpha/lowercase/c.constant';
import { CHAR_f } from '../../../../../../chars/alpha/lowercase/f.constant';

const REFERENCES_HEADER_NAME = new Uint8Array([
  CHAR_R,
  CHAR_e,
  CHAR_f,
  CHAR_e,
  CHAR_r,
  CHAR_e,
  CHAR_n,
  CHAR_c,
  CHAR_e,
  CHAR_s,
  CHAR_COLON,
  CHAR_SPACE,
]);

export function smtpDataContentHeader$References$BufferEncoderRaw(
  messageIds: ArrayLike<MessageId>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    REFERENCES_HEADER_NAME,
    buffer,
    index,
  );

  index = smtpDataContentHeader$MessageIdList$BufferEncoder(
    messageIds,
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}


export function smtpDataContentHeader$References$BufferEncoder(
  messageIds: ArrayLike<MessageId>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  return (messageIds.length > 0)
    ? smtpDataContentHeader$References$BufferEncoderRaw(messageIds, buffer, index)
    : index;
}

