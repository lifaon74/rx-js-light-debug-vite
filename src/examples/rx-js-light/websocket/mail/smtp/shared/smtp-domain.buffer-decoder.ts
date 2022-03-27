import { u32, u8 } from '@lifaon/number-types';
import { CHAR_COLON } from '../../../chars/colon.constant';
import { CHAR_RIGHT_SQUARE_BRACKET } from '../../../chars/right-square-bracket.constant';
import { CHAR_MINUS } from '../../../chars/minus.constant';
import { CHAR_DOT } from '../../../chars/dot.constant';
import { CHAR_LEFT_SQUARE_BRACKET } from '../../../chars/left-square-bracket.constant';
import { isAlphaNumericChar } from '../../../chars/is/is-alpha-numeric-char';

import { simpleStringBufferDecoderWithThrowIfEndIsReached } from '../../../encoding/functions/simple-string.buffer-decoder';
import { Domain } from '../../classes/domain/domain.class';
import { IBufferDecoderResult } from '../../../encoding/types/buffer-decoder/buffer-decoder.type';
import { ASCIIString } from '../../classes/ascii-string/ascii-string.class';

// https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.2

export function smtp$Domain$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<Domain> {
  let domain: ASCIIString;
  [index, domain] = simpleStringBufferDecoderWithThrowIfEndIsReached(
    isSMTP$Domain$Char,
    buffer,
    index,
  );

  return [
    index,
    Domain.fromString(domain.toString()),
  ];
}

function isSMTP$Domain$Char(
  byte: u8,
): boolean {
  return isAlphaNumericChar(byte)
    || (byte === CHAR_MINUS)
    || (byte === CHAR_DOT)
    || (byte === CHAR_LEFT_SQUARE_BRACKET)
    || (byte === CHAR_RIGHT_SQUARE_BRACKET)
    || (byte === CHAR_COLON);
}

