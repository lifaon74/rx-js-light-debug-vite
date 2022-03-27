import { u32 } from '@lifaon/number-types';
import { CHAR_COLON } from '../../../../../../chars/colon.constant';
import { CHAR_T } from '../../../../../../chars/alpha/uppercase/T.constant';
import { CHAR_SPACE } from '../../../../../../chars/space.constant';
import {
  smtpDataContentHeader$AddressList$BufferEncoder,
} from './address/smtp-data-content-header-address-list.buffer-encoder';
import { CHAR_o } from '../../../../../../chars/alpha/lowercase/o.constant';
import { CHAR_MINUS } from '../../../../../../chars/minus.constant';
import { CHAR_R } from '../../../../../../chars/alpha/uppercase/R.constant';
import { CHAR_e } from '../../../../../../chars/alpha/lowercase/e.constant';
import { CHAR_l } from '../../../../../../chars/alpha/lowercase/l.constant';
import { CHAR_y } from '../../../../../../chars/alpha/lowercase/y.constant';
import { CHAR_p } from '../../../../../../chars/alpha/lowercase/p.constant';
import { IEmailAddressLike } from '../../../../../classes/email-address-like/email-address-like.type';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';

const REPLY_TO_HEADER_NAME = new Uint8Array([
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

export function smtpDataContentHeader$ReplyTo$BufferEncoderRaw(
  addressList: ArrayLike<IEmailAddressLike>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    REPLY_TO_HEADER_NAME,
    buffer,
    index,
  );

  index = smtpDataContentHeader$AddressList$BufferEncoder(
    addressList,
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}


export function smtpDataContentHeader$ReplyTo$BufferEncoder(
  addressList: ArrayLike<IEmailAddressLike>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  return (addressList.length > 0)
    ? smtpDataContentHeader$ReplyTo$BufferEncoderRaw(addressList, buffer, index)
    : index;
}

