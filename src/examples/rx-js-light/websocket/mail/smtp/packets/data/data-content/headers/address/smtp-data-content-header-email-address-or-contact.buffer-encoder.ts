import { EmailAddress } from '../../../../../../classes/email-address/email-address.class';
import { u32 } from '@lifaon/number-types';
import {
  smtpDataContentHeader$EmailContact$BufferEncoder,
} from './smtp-data-content-header-email-contact.buffer-encoder';
import {
  smtpDataContentHeader$EmailAddress$BufferEncoder,
} from './smtp-data-content-header-email-address.buffer-encoder';
import { IEmailAddressLike } from '../../../../../../classes/email-address-like/email-address-like.type';

export function smtpDataContentHeader$EmailAddressOrContact$BufferEncoder(
  input: IEmailAddressLike,
  buffer: Uint8Array,
  index: u32,
): u32 {
  return (input instanceof EmailAddress)
    ? smtpDataContentHeader$EmailAddress$BufferEncoder(input, buffer, index)
    : smtpDataContentHeader$EmailContact$BufferEncoder(input, buffer, index);
}
