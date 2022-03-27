import { u32 } from '@lifaon/number-types';
import { CHAR_COLON } from '../../../../../../chars/colon.constant';
import { CHAR_T } from '../../../../../../chars/alpha/uppercase/T.constant';
import { CHAR_SPACE } from '../../../../../../chars/space.constant';
import {
  smtpDataContentHeader$AddressList$BufferEncoder,
} from './address/smtp-data-content-header-address-list.buffer-encoder';
import { CHAR_o } from '../../../../../../chars/alpha/lowercase/o.constant';
import { IEmailAddressLike } from '../../../../../classes/email-address-like/email-address-like.type';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';

const TO_HEADER_NAME = new Uint8Array([
  CHAR_T,
  CHAR_o,
  CHAR_COLON,
  CHAR_SPACE,
]);

export function smtpDataContentHeader$To$BufferEncoderRaw(
  addressList: ArrayLike<IEmailAddressLike>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    TO_HEADER_NAME,
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


export function smtpDataContentHeader$To$BufferEncoder(
  addressList: ArrayLike<IEmailAddressLike>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  if (addressList.length > 0) {
    return smtpDataContentHeader$To$BufferEncoderRaw(addressList, buffer, index);
  } else {
    throw new Error(`'To' must contain at least one address`);
  }
}
