import { createInvalidASCIICharacterError } from './create-invalid-ascii-character-error';

export function verifyACSIIChars(
  input: Uint8Array,
): Uint8Array {
  for (let i = 0; i < input.length; i++) {
    if (input[i] > 0x7f) {
      throw createInvalidASCIICharacterError(input[i], i);
    }
  }
  return input;
}
