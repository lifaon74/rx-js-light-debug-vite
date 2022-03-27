import { u32 } from '@lifaon/number-types';
import { MessageId } from '../../../../../../classes/message-id/message-id.class';
import {
  smtpDataContentHeader$MessageIdClass$BufferEncoder,
} from './smtp-data-content-header-message-id-class.buffer-encoder';
import {
  smtpDataContentHeader$CommaSpaceList$BufferEncoder,
} from '../shared/smtp-data-content-header-comma-space.buffer-encoder';

export function smtpDataContentHeader$MessageIdList$BufferEncoder(
  messageIds: ArrayLike<MessageId>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  return smtpDataContentHeader$CommaSpaceList$BufferEncoder<MessageId>(
    messageIds,
    smtpDataContentHeader$MessageIdClass$BufferEncoder,
    buffer,
    index,
  );
}
