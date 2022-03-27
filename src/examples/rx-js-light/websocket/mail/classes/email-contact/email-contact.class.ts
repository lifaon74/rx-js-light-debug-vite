import { EmailAddress } from '../email-address/email-address.class';
import { ASCIIString } from '../ascii-string/ascii-string.class';

export class EmailContact {
  readonly name: ASCIIString;
  readonly address: EmailAddress;

  constructor(
    name: ASCIIString,
    address: EmailAddress,
  ) {
    // TODO support quoted string and check name validity
    this.name = name;
    this.address = address;
  }

  toString(): string {
    return `${this.name.toString()} <${this.address.toString()}>`;
  }
}
