import { u32 } from '@lifaon/number-types';
import { throwNotEnoughSpaceError } from '../errors/not-enough-space/not-enough-space-error';

export function isUint8ArrayReadable(
  buffer: Uint8Array,
  index: u32,
  requiredSize: u32,
): boolean {
  return (buffer.length >= (index + requiredSize));
}

export function ensureUint8ArrayHasEnoughSpace(
  buffer: Uint8Array,
  index: u32,
  requiredSize: u32,
): void {
  if (!isUint8ArrayReadable(buffer, index, requiredSize)) {
    throwNotEnoughSpaceError();
  }
}


