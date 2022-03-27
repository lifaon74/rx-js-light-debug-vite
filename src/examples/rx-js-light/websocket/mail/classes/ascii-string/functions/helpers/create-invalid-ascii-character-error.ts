export function createInvalidASCIICharacterError(
  found: number,
  position: number,
): Error {
  return new Error(`Expected character in the range [0-127], found '${String.fromCharCode(found)}' (0x${found.toString(16).padStart(2, '0')}) at position ${position}`);
}
