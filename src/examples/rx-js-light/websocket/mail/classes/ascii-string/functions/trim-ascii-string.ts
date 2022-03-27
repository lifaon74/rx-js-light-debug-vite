import { ASCIIString } from '../ascii-string.class';
import { getTrimEndIndexForUint8Array } from './helpers/trim/get-trim-end-index-for-ascii-string';
import { getTrimStartIndexForUint8Array } from './helpers/trim/get-trim-start-index-for-ascii-string';

export function trimShallowASCIIString(
  input: ASCIIString,
): ASCIIString {
  return ASCIIString.fromSafeBuffer(
    trimShallowUint8Array(input.chars),
  );
}

export function trimShallowUint8Array(
  input: Uint8Array,
): Uint8Array {
  return input.subarray(
    getTrimStartIndexForUint8Array(input, 0),
    getTrimEndIndexForUint8Array(input, 0),
  );
}
