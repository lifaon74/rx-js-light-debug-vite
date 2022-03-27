import { ASCIIString } from '../ascii-string/ascii-string.class';
import { Domain } from '../domain/domain.class';

export class EmailAddress {

  static from(
    input: string,
  ): EmailAddress {
    return this.fromString(input);
  }

  static fromString(
    input: string,
  ): EmailAddress {
    const index: number = input.lastIndexOf('@');

    if (index === -1) {
      throw createInvalidEmailAddressError(`missing @`);
    }

    const localpart: string = input.slice(0, index);
    const domain: string = input.slice(index + 1);

    /* LOCALPART */
    if (
      !LOCAL_PART_REGEXP.test(localpart)
      && !QUOTED_LOCAL_PART_REGEXP.test(localpart)
      && (localpart.length <= 64)
    ) {
      throw createInvalidEmailAddressError(`invalid localpart`);
    }

    return new EmailAddress(
      ASCIIString.fromSafeString(localpart),
      Domain.fromString(domain),
    )
  }

  readonly localpart: ASCIIString;
  readonly domain: Domain;

  protected constructor(
    localpart: ASCIIString,
    domain: Domain,
  ) {
    this.localpart = localpart;
    this.domain = domain;
  }

  get localpartUnquoted(): ASCIIString {
    return ASCIIString.fromSafeString(
      this.localpart.toString().replace(new RegExp('\\\\([^\\x0a\\x0d])', 'g'), '$1').slice(1, -1),
    );
  }

  toString(): string {
    return `${this.localpart.toString()}@${this.domain.toString()}`;
  }
}


/*-----------------------*/


function createInvalidEmailAddressError(
  message: string,
): Error {
  return new Error(`Invalid email address: ${message}`);
}

const LOCAL_PART_REGEXP: RegExp = new RegExp('^[A-Za-z0-9!#$%&\'*+\\-/=?^_`{|}~.]+$');

// [\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f] === [^\x09-\x0a\x0d\x20\x5c]
const QUOTED_LOCAL_PART_REGEXP: RegExp = new RegExp('^"(?:[^\\x09-\\x0a\\x0d\\x20\\x5c]|\\\\[^\\x0a\\x0d])+"$');


