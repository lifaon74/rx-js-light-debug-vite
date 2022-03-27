import { u32, u8 } from '../number-types/dist';
import { throwNotEnoughSpaceError } from '../../errors/not-enough-space/not-enough-space-error';

export function shiftEqualUint8Array(
  buffer: Uint8Array,
  index: u32,
  value: u8,
): number {
  if (index < buffer.length) {
    buffer[index] = value;
    return index + 1;
  } else {
    throwNotEnoughSpaceError();
  }
}
