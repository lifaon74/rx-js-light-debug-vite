import { ASCIIString } from '../ascii-string.class';
import { isAlphaLowerChar } from '../../../../chars/is/is-alpha-lower-char';

export function asciiStringToUpperCase(
  _input: ASCIIString,
): ASCIIString {
  const input: Uint8Array = _input.chars;
  const output: Uint8Array = new Uint8Array(input.length);
  for (let i = 0, l = input.length; i < l; i++) {
    output[i] = isAlphaLowerChar(input[i])
      ? (input[i] - 0x20)
      : input[i];
  }
  return ASCIIString.fromSafeBuffer(output);
}
