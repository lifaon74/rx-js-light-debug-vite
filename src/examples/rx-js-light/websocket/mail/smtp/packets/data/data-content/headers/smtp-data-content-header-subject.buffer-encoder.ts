import { u32, u8 } from '@lifaon/number-types';
import { CHAR_COLON } from '../../../../../../chars/colon.constant';
import { CHAR_SPACE } from '../../../../../../chars/space.constant';
import { ASCIIString } from '../../../../../classes/ascii-string/ascii-string.class';
import { CHAR_t } from '../../../../../../chars/alpha/lowercase/t.constant';
import { CHAR_e } from '../../../../../../chars/alpha/lowercase/e.constant';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';
import { CHAR_S } from '../../../../../../chars/alpha/uppercase/S.constant';
import { CHAR_c } from '../../../../../../chars/alpha/lowercase/c.constant';
import { CHAR_b } from '../../../../../../chars/alpha/lowercase/b.constant';
import { CHAR_u } from '../../../../../../chars/alpha/lowercase/u.constant';
import { CHAR_j } from '../../../../../../chars/alpha/lowercase/j.constant';
import { CHAR_CR } from '../../../../../../chars/CR.constant';
import { CHAR_LF } from '../../../../../../chars/LF.constant';
import { ensureUint8ArrayHasEnoughSpace } from '../../../../../../array-buffer/ensure-uint8-array-has-enough-space';

const SUBJECT_HEADER_NAME = new Uint8Array([
  CHAR_S,
  CHAR_u,
  CHAR_b,
  CHAR_j,
  CHAR_e,
  CHAR_c,
  CHAR_t,
  CHAR_COLON,
  CHAR_SPACE,
]);

// const MAX_LENGTH = 78 - SUBJECT_HEADER_NAME.length - 2; // CRLF
const MAX_LENGTH = 67;

export function smtpDataContentHeader$Subject$BufferEncoder(
  subject: ASCIIString,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    SUBJECT_HEADER_NAME,
    buffer,
    index,
  );

  let i: number = 0;
  const chars: Uint8Array = subject.chars;

  // TODO test algorithm
  while ((subject.chars.length - i) > MAX_LENGTH) {
    const maxSplitIndex: number = Math.min(chars.length, i + MAX_LENGTH);

    let j: number = maxSplitIndex - 1;
    while ((j >= i) && !isWhiteSpaceCharacter(chars[j])) {
      j--;
    }

    const splitIndex: number = (j < i)
      ? maxSplitIndex
      : j;

    const splitChar: u8 = (j < i)
      ? CHAR_SPACE
      : chars[j];

    const part: Uint8Array = subject.chars.subarray(i, splitIndex);

    index = uint8ArrayBufferEncoder(
      part,
      buffer,
      index,
    );

    ensureUint8ArrayHasEnoughSpace(
      buffer,
      index,
      3, // CRLF SP
    );

    buffer[index++] = CHAR_CR;
    buffer[index++] = CHAR_LF;
    buffer[index++] = splitChar;

    i = splitIndex + 1;
  }

  index = uint8ArrayBufferEncoder(
    subject.chars.subarray(i),
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}


function isWhiteSpaceCharacter(
  byte: u8,
): boolean {
  return (byte === 32) // SP
    || (byte === 9); // TAB
}
