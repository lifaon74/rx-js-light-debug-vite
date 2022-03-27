import { u32 } from '@lifaon/number-types';
import { CHAR_COLON } from '../../../../../../chars/colon.constant';
import { CHAR_T } from '../../../../../../chars/alpha/uppercase/T.constant';
import { CHAR_SPACE } from '../../../../../../chars/space.constant';
import { CHAR_o } from '../../../../../../chars/alpha/lowercase/o.constant';
import { CHAR_MINUS } from '../../../../../../chars/minus.constant';
import { CHAR_R } from '../../../../../../chars/alpha/uppercase/R.constant';
import { CHAR_e } from '../../../../../../chars/alpha/lowercase/e.constant';
import { CHAR_l } from '../../../../../../chars/alpha/lowercase/l.constant';
import { CHAR_y } from '../../../../../../chars/alpha/lowercase/y.constant';
import { CHAR_p } from '../../../../../../chars/alpha/lowercase/p.constant';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';
import { CHAR_I } from '../../../../../../chars/alpha/uppercase/I.constant';
import { CHAR_n } from '../../../../../../chars/alpha/lowercase/n.constant';
import { MessageId } from '../../../../../classes/message-id/message-id.class';
import {
  smtpDataContentHeader$MessageIdList$BufferEncoder,
} from './message-id/smtp-data-content-header-message-id-list.buffer-encoder';

const IN_REPLY_TO_HEADER_NAME = new Uint8Array([
  CHAR_I,
  CHAR_n,
  CHAR_MINUS,
  CHAR_R,
  CHAR_e,
  CHAR_p,
  CHAR_l,
  CHAR_y,
  CHAR_MINUS,
  CHAR_T,
  CHAR_o,
  CHAR_COLON,
  CHAR_SPACE,
]);

export function smtpDataContentHeader$InReplyTo$BufferEncoderRaw(
  messageIds: ArrayLike<MessageId>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    IN_REPLY_TO_HEADER_NAME,
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


export function smtpDataContentHeader$InReplyTo$BufferEncoder(
  messageIds: ArrayLike<MessageId>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  return (messageIds.length > 0)
    ? smtpDataContentHeader$InReplyTo$BufferEncoderRaw(messageIds, buffer, index)
    : index;
}

