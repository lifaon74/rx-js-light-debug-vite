import { verifyACSIIChars } from './functions/helpers/verify-acsii-chars';
import { stringToACSIICharsUnsafe } from './functions/helpers/string-to-acsii-chars-unsafe';


export class ASCIIString {

  /* FROM */

  static fromSafeBuffer(
    input: Uint8Array,
  ): ASCIIString {
    return new ASCIIString(input);
  }

  static fromUnsafeBuffer(
    input: Uint8Array,
  ): ASCIIString {
    return this.fromSafeBuffer(verifyACSIIChars(input));
  }

  static fromSafeString(
    input: string,
  ): ASCIIString {
    return this.fromSafeBuffer(stringToACSIICharsUnsafe(input));
  }

  static fromUnsafeString(
    input: string,
  ): ASCIIString {
    return this.fromUnsafeBuffer(stringToACSIICharsUnsafe(input));
  }

  static from(
    input: string | Uint8Array,
  ): ASCIIString {
    return (typeof input === 'string')
      ? this.fromUnsafeString(input)
      : this.fromUnsafeBuffer(input);
  }

  readonly chars: Readonly<Uint8Array>;

  protected constructor(
    input: Uint8Array,
  ) {
    this.chars = input;
  }

  get length(): number {
    return this.chars.length;
  }

  slice(
    start?: number,
    end?: number
  ): ASCIIString {
    return new ASCIIString(this.chars.slice(start, end));
  }

  subarray(
    start?: number,
    end?: number
  ): ASCIIString {
    return new ASCIIString(this.chars.subarray(start, end));
  }

  clone(): ASCIIString {
    return new ASCIIString(this.chars);
  }

  toString(): string {
    return String.fromCharCode.apply(null, this.chars);
  }
}

