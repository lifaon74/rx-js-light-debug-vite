import { u32, u8 } from '@lifaon/number-types';

// const BYTE_TO_BASE64_MAP = new Uint8Array('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/='.split('').map(_ => _.charCodeAt(0)));
const BYTE_TO_BASE64_MAP = new Uint8Array(122);
'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'.split('').forEach((char: string, index: number) => {
  BYTE_TO_BASE64_MAP[char.charCodeAt(0)] = index;
});

export function decodeUint8ArrayFromBase64(
  input: Uint8Array,
): Uint8Array {
  const inputLength: u32 = input.length;
  const padLength: u32 = getPadLength(input);
  const inputLengthWithoutPad: u32 = inputLength - padLength;
  const outputPadLength: u32 = Math.ceil(padLength * (3 / 4));
  const outputLength: u32 = (inputLength / 4) * 3;
  const output: Uint8Array = new Uint8Array(outputLength);

  let i: u32 = 0;
  let j: u32 = 0;

  for (const l: u32 = Math.floor(inputLengthWithoutPad / 4) * 4; i < l; i += 4) {
    j = decode4BytesFromBase64(
      input[i],
      input[i + 1],
      input[i + 2],
      input[i + 3],
      output,
      j,
    );
  }

  if (i < inputLength) {
    decode4BytesFromBase64(
      input[i],
      ((i + 1) < inputLength) ? input[i + 1] : 0,
      ((i + 2) < inputLength) ? input[i + 2] : 0,
      ((i + 3) < inputLength) ? input[i + 3] : 0,
      output,
      j,
    );
  }

  return output.subarray(0, outputLength - outputPadLength);
}

function getPadLength(
  input: Uint8Array,
): u32 {
  let padLength: u32 = 0;
  let i: u32 = input.length - 1;
  while ((i >= 0) && (input[i] === 61)) { // '='
    padLength++;
    i--;
  }
  return padLength;
}

function decode4BytesFromBase64(
  byte0: u8,
  byte1: u8,
  byte2: u8,
  byte3: u8,
  buffer: Uint8Array,
  index: u32,
): u32 {
  const i0: u8 = BYTE_TO_BASE64_MAP[byte0];
  const i1: u8 = BYTE_TO_BASE64_MAP[byte1];
  const i2: u8 = BYTE_TO_BASE64_MAP[byte2];
  const i3: u8 = BYTE_TO_BASE64_MAP[byte3];

  const _byte0: u8 = (i0 << 2) | ((i1 & 0b00110000) >> 4);
  const _byte1: u8 = ((i1 & 0b00001111) << 4) | ((i2 & 0b00111100) >> 2);
  const _byte3: u8 = ((i2 & 0b00000011) << 6) | i3;

  buffer[index++] = _byte0;
  buffer[index++] = _byte1;
  buffer[index++] = _byte3;

  return index;
}
