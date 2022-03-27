import { EmailAddress } from '../email-address/email-address.class';
import { EmailContact } from '../email-contact/email-contact.class';
import { IEmailAddressLike } from './email-address-like.type';

export function emailAddressLikeToEmailAddress(
  address: IEmailAddressLike,
): EmailAddress {
  return (address instanceof EmailContact)
    ? address.address
    : address;
}
