import { ASCIIString } from '../ascii-string/ascii-string.class';

// const CHARS = (() => {
//   const chars = [];
//   // 0-9
//   for (let i = 0x30 /* 0 */; i <= 0x39 /* 9 */; i++) {
//     chars.push(i);
//   }
//
//   // A-Z
//   for (let i = 0x41 /* A */; i <= 0x5a /* Z */; i++) {
//     chars.push(i);
//   }
//
//   // a-z
//   for (let i = 0x61 /* a */; i <= 0x7a /* z */; i++) {
//     chars.push(i);
//   }
//
//   return chars;
// })();

const CHARS = new Uint8Array([
  48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122,
]);

export class Boundary {
  static generate(
    length: number = 36,
    randomChars: number = 24,
  ): Boundary {
    randomChars = Math.min(randomChars, length);

    const bytes: Uint8Array = crypto.getRandomValues(new Uint8Array(length));
    const ratio: number = CHARS.length / 256;

    const j: number = length - randomChars;

    for (let i = 0; i < j; i++) {
      bytes[i] = 0x2d; // -
    }

    for (let i = length - randomChars; i < length; i++) {
      bytes[i] = CHARS[Math.floor(bytes[i] * ratio)];
    }

    return new Boundary(
      ASCIIString.fromSafeBuffer(bytes),
    );
  }

  readonly value: ASCIIString;

  constructor(
    value: ASCIIString,
  ) {
    this.value = value;
  }

  toString(): string {
    return this.value.toString();
  }
}
