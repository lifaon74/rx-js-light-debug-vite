import { u32, u8 } from '@lifaon/number-types';

// const BYTE_TO_BASE64_MAP = new Uint8Array('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('').map(_ => _.charCodeAt(0)));
const BYTE_TO_BASE64_MAP = new Uint8Array([
  65, 66, 67, 68, 69, 70, 71, 72, 73, 74, 75, 76, 77, 78, 79, 80, 81, 82, 83, 84, 85, 86, 87, 88, 89, 90, 97, 98, 99, 100, 101, 102, 103, 104, 105, 106, 107, 108, 109, 110, 111, 112, 113, 114, 115, 116, 117, 118, 119, 120, 121, 122, 48, 49, 50, 51, 52, 53, 54, 55, 56, 57, 43, 47,
]);


export function encodeUint8ArrayToBase64(
  input: Uint8Array,
): Uint8Array {
  const inputLength: u32 = input.length;
  const outputLength: u32 = Math.ceil(inputLength / 3) * 4;
  const output: Uint8Array = new Uint8Array(outputLength);

  const padLength: u8 = inputLength % 3;

  let i: u32 = 0;
  let j: u32 = 0;

  for (const l: u32 = Math.floor(inputLength / 3) * 3; i < l; i += 3) {
    j = encode3BytesToBase64(
      input[i],
      input[i + 1],
      input[i + 2],
      output,
      j,
    );
  }

  if (i < inputLength) {
    encode3BytesToBase64(
      input[i],
      ((i + 1) < inputLength) ? input[i + 1] : 0,
      ((i + 2) < inputLength) ? input[i + 2] : 0,
      output,
      j,
    );
  }

  if (padLength > 0) {
    for (j = outputLength + padLength - 3; j < outputLength; j++) {
      output[j] = 61; // '='
    }
  }

  return output;
}


function encode3BytesToBase64(
  byte0: u8,
  byte1: u8,
  byte2: u8,
  buffer: Uint8Array,
  index: u32,
): u32 {
  const i0: u8 = (byte0 & 0b11111100) >> 2;
  const i1: u8 = ((byte0 & 0b00000011) << 4) | ((byte1 & 0b11110000) >> 4);
  const i2: u8 = ((byte1 & 0b00001111) << 2) | ((byte2 & 0b11000000) >> 6);
  const i3: u8 = byte2 & 0b00111111;

  const _byte0: u8 = BYTE_TO_BASE64_MAP[i0];
  const _byte1: u8 = BYTE_TO_BASE64_MAP[i1];
  const _byte2: u8 = BYTE_TO_BASE64_MAP[i2];
  const _byte3: u8 = BYTE_TO_BASE64_MAP[i3];

  buffer[index++] = _byte0;
  buffer[index++] = _byte1;
  buffer[index++] = _byte2;
  buffer[index++] = _byte3;

  return index;
}
