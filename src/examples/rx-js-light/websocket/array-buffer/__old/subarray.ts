import { u32 } from '../number-types/dist';

export function subarray(
  buffer: Uint8Array,
  index: u32,
): Uint8Array {
  return (index === 0)
    ? buffer
    : buffer.subarray(index);
}
