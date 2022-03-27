import {
  smtpDataContentHeader$EmailAddressOrContact$BufferEncoder,
} from './smtp-data-content-header-email-address-or-contact.buffer-encoder';
import { u32 } from '@lifaon/number-types';
import { IEmailAddressLike } from '../../../../../../classes/email-address-like/email-address-like.type';
import {
  smtpDataContentHeader$CommaSpaceList$BufferEncoder,
} from '../shared/smtp-data-content-header-comma-space.buffer-encoder';

export function smtpDataContentHeader$AddressList$BufferEncoder(
  addressList: ArrayLike<IEmailAddressLike>,
  buffer: Uint8Array,
  index: u32,
): u32 {
  return smtpDataContentHeader$CommaSpaceList$BufferEncoder<IEmailAddressLike>(
    addressList,
    smtpDataContentHeader$EmailAddressOrContact$BufferEncoder,
    buffer,
    index,
  );
}
