import { IEmailAddress } from './email-address.type';
import { EMAIL_ADDRESS_REGEXP } from './email-address-regexp.constant';

export function parseEmailAddress(
  input: string,
): IEmailAddress | null {
  const match: RegExpExecArray | null = EMAIL_ADDRESS_REGEXP.exec(input);
  return (match === null)
    ? null
    : {
      username: match[1],
      hostname: match[2],
    };
}
