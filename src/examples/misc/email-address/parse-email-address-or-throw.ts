import { IEmailAddress } from './email-address.type';
import { parseEmailAddress } from './parse-email-address';

export function parseEmailAddressOrThrow(
  input: string,
): IEmailAddress {
  const result: IEmailAddress | null = parseEmailAddress(input);
  if (result === null) {
    throw new Error(`Not a valid email address`);
  } else {
    return result;
  }
}
