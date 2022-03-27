import { u32 } from '@lifaon/number-types';
import { CHAR_COLON } from '../../../../../../chars/colon.constant';
import { CHAR_SPACE } from '../../../../../../chars/space.constant';
import {
  smtpDataContentHeader$AddressList$BufferEncoder,
} from './address/smtp-data-content-header-address-list.buffer-encoder';
import { CHAR_c } from '../../../../../../chars/alpha/lowercase/c.constant';
import { CHAR_B } from '../../../../../../chars/alpha/uppercase/B.constant';
import { IEmailAddressLike } from '../../../../../classes/email-address-like/email-address-like.type';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';

const BCC_HEADER_NAME = new Uint8Array([
  CHAR_B,
  CHAR_c,
  CHAR_c,
  CHAR_COLON,
  CHAR_SPACE,
]);

export function smtpDataContentHeader$Bcc$BufferEncoderRaw(
  addressList: ArrayLike<IEmailAddressLike>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    BCC_HEADER_NAME,
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


export function smtpDataContentHeader$Bcc$BufferEncoder(
  addressList: ArrayLike<IEmailAddressLike>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  return (addressList.length > 0)
    ? smtpDataContentHeader$Bcc$BufferEncoderRaw(addressList, buffer, index)
    : index;
}

