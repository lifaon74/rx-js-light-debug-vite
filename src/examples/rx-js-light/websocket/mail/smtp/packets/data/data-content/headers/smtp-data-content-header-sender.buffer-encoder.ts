import { u32 } from '@lifaon/number-types';
import { CHAR_COLON } from '../../../../../../chars/colon.constant';
import { CHAR_SPACE } from '../../../../../../chars/space.constant';
import { CHAR_r } from '../../../../../../chars/alpha/lowercase/r.constant';
import { CHAR_e } from '../../../../../../chars/alpha/lowercase/e.constant';
import { CHAR_S } from '../../../../../../chars/alpha/uppercase/S.constant';
import { CHAR_d } from '../../../../../../chars/alpha/lowercase/d.constant';
import { CHAR_n } from '../../../../../../chars/alpha/lowercase/n.constant';
import { IEmailAddressLike } from '../../../../../classes/email-address-like/email-address-like.type';
import {
  smtpDataContentHeader$EmailAddressOrContact$BufferEncoder,
} from './address/smtp-data-content-header-email-address-or-contact.buffer-encoder';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';

const SENDER_HEADER_NAME = new Uint8Array([
  CHAR_S,
  CHAR_e,
  CHAR_n,
  CHAR_d,
  CHAR_e,
  CHAR_r,
  CHAR_COLON,
  CHAR_SPACE,
]);

export function smtpDataContentHeader$Sender$BufferEncoderRaw(
  address: IEmailAddressLike,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    SENDER_HEADER_NAME,
    buffer,
    index,
  );

  index = smtpDataContentHeader$EmailAddressOrContact$BufferEncoder(
    address,
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}


export function smtpDataContentHeader$Sender$BufferEncoder(
  sender: IEmailAddressLike,
  from: ArrayLike<IEmailAddressLike>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  return (
    (from.length === 1)
    && (from[0] === sender) // TODO improve equal
  ) // field is optional
    ? index
    : smtpDataContentHeader$Sender$BufferEncoderRaw(sender, buffer, index);
}
