import { u8 } from '@lifaon/number-types';
import { toHex } from '../../misc/to-hex';


function u8ToHex(
  value: u8,
): string {
  return `0x${toHex(value, 2)}`;
}

function u8ToString(
  value: u8,
): string {
  return `'${String.fromCharCode(value)}' (${u8ToHex(value)})`;
}

export function createExpectedByteError(
  expected: u8,
  found: u8,
): Error {
  return new SyntaxError(`Expected ${u8ToString(expected)}, found ${u8ToString(found)}`);
}

export function createExpectedOrBytesError(
  expected: readonly u8[],
  found: u8,
): Error {
  return new SyntaxError(`Expected ${expected.map(u8ToString).join(' or ')}, found ${u8ToString(found)}`);
}
