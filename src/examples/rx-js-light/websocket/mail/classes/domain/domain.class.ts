import { ASCIIString } from '../ascii-string/ascii-string.class';

export class Domain {
  static fromString(
    input: string,
  ): Domain {
    try {
      const url: URL = new URL(`https://${input}`);
      if (input === url.hostname) {
        return new Domain(ASCIIString.fromSafeString(input));
      } else {
        throw null;
      }
    } catch {
      throw new Error(`Invalid domain`);
    }
  }

  static from(
    input: string,
  ): Domain {
    return this.fromString(input);
  }

  readonly value: ASCIIString;

  protected constructor(
    domain: ASCIIString,
  ) {
    this.value = domain;
  }

  toString(): string {
    return this.value.toString();
  }
}
