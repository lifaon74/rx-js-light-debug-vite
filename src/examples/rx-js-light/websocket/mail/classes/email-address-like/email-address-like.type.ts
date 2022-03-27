import { EmailAddress } from '../email-address/email-address.class';
import { EmailContact } from '../email-contact/email-contact.class';

export type IEmailAddressLike =
  | EmailAddress
  | EmailContact
  ;


