import { EMAIL_ADDRESS_REGEXP } from './email-address-regexp.constant';

export function isEmailAddressValid(
  input: string,
): boolean {
  return EMAIL_ADDRESS_REGEXP.test(input);
}
