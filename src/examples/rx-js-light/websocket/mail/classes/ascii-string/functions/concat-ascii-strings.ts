import { ASCIIString } from '../ascii-string.class';

export function concatASCIIStrings(
  input: ArrayLike<ASCIIString>,
): ASCIIString {
  let length: number = 0;

  for (let i = 0; i < input.length; i++) {
    length += input[i].length;
  }

  const chars: Uint8Array = new Uint8Array(length);

  length = 0;
  for (let i = 0; i < input.length; i++) {
    chars.set(input[i].chars, length);
    length += input[i].length;
  }

  return ASCIIString.fromSafeBuffer(chars);
}
