import { u32 } from '@lifaon/number-types';
import { toHex } from './to-hex';

// https://en.wikipedia.org/wiki/Universally_unique_identifier

export function generateUID(
  size: number, // in bytes
): string {
  const bytes: Uint8Array = crypto.getRandomValues(new Uint8Array(size));
  let output: string = '';
  for (let i: u32 = 0; i < size; i++) {
    output += toHex(bytes[i], 2);
  }
  return output;
}

export function generateUUID(): string {
  return generateUID(16);
}
