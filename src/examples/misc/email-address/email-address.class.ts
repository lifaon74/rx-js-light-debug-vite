import { IReadonlyEmailAddress } from './email-address.type';
import { isEmailAddressValid } from './is-email-address-valid';
import { parseEmailAddressOrThrow } from './parse-email-address-or-throw';
import { emailAddressToString } from './email-address-to-string';

export class EmailAddress implements IReadonlyEmailAddress {

  static isValid(
    input: string,
  ): boolean {
    return isEmailAddressValid(input);
  }

  readonly username: string;
  readonly hostname: string;

  constructor(
    input: string,
  ) {
    const { username, hostname } = parseEmailAddressOrThrow(input);
    this.username = username;
    this.hostname = hostname;
  }

  get address(): string {
    return emailAddressToString(this);
  }

  toString(): string {
    return emailAddressToString(this);
  }
}


