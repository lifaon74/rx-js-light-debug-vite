export function stringToACSIICharsUnsafe(
  input: string,
): Uint8Array {
  const chars: Uint8Array = new Uint8Array(input.length);
  for (let i = 0, l = input.length; i < l; i++) {
    chars[i] = input.charCodeAt(i);
  }
  return chars;
}
