import { ISMTP$EHLO_OK_RSP$Packet, ISMTP$EHLO_OK_RSP$PacketLine } from './smtp-ehlo-ok-rsp-packet.type';
import { u32, u8 } from '@lifaon/number-types';
import { CHAR_2 } from '../../../../../chars/digits/2.constant';
import { CHAR_0 } from '../../../../../chars/digits/0.constant';
import { CHAR_SPACE } from '../../../../../chars/space.constant';
import { CHAR_MINUS } from '../../../../../chars/minus.constant';
import { smtp$Domain$BufferDecoder } from '../../../shared/smtp-domain.buffer-decoder';
import { simpleStringBufferDecoderWithThrowIfEndIsReached } from '../../../../../encoding/functions/simple-string.buffer-decoder';
import { isAlphaNumericChar } from '../../../../../chars/is/is-alpha-numeric-char';
import { ASCIIString } from '../../../../classes/ascii-string/ascii-string.class';
import { EMPTY_ASCII_STRING } from '../../../../classes/ascii-string/empty-ascii-string.constant';
import { smtp$Code$BufferDecoder } from '../../../shared/smtp-code.buffer-decoder';
import { bufferDecoderExpectsCRLF } from '../../../../../encoding/functions/buffer-decoder-expects-crlf';
import { IBufferDecoderResult } from '../../../../../encoding/types/buffer-decoder/buffer-decoder.type';
import { Domain } from '../../../../classes/domain/domain.class';
import { CHAR_5 } from '../../../../../chars/digits/5.constant';

// https://datatracker.ietf.org/doc/html/rfc5321#section-4.1.1.1

export function smtp$EHLO_OK_RSP$PacketBufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ISMTP$EHLO_OK_RSP$Packet> {
  let hasNextLine: boolean;

  // code
  [index, hasNextLine] = smtp$EHLO_OK_RSP_CODE$BufferDecoder(buffer, index);

  // domain
  let domain: Domain;
  [index, domain] = smtp$Domain$BufferDecoder(buffer, index);

  // greet
  let greet: ASCIIString;
  if (buffer[index] === CHAR_SPACE) {
    [index, greet] = smtp$EHLO_GREET$BufferDecoder(buffer, index + 1);
  } else {
    greet = EMPTY_ASCII_STRING;
  }

  // CRLF
  [index] = bufferDecoderExpectsCRLF(buffer, index);

  // lines
  const lines: ISMTP$EHLO_OK_RSP$PacketLine[] = [];
  while (hasNextLine) {
    // code
    [index, hasNextLine] = smtp$EHLO_OK_RSP_CODE$BufferDecoder(buffer, index);

    // line
    let line: ISMTP$EHLO_OK_RSP$PacketLine;
    [index, line] = smtp$EHLO_LINE$BufferDecoder(buffer, index);
    lines.push(line);

    // CRLF
    [index] = bufferDecoderExpectsCRLF(buffer, index);
  }

  return [
    index,
    {
      domain,
      greet,
      lines,
    },
  ];
}

/*---------------------*/

/* EHLO_OK_RSP_CODE */

const EHLO_OK_RSP_CODE = new Uint8Array([
  CHAR_2,
  CHAR_5,
  CHAR_0,
]);

function smtp$EHLO_OK_RSP_CODE$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<boolean> {
  return smtp$Code$BufferDecoder(
    EHLO_OK_RSP_CODE,
    buffer,
    index,
  );
}


/* EHLO_GREET */

function smtp$EHLO_GREET$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  return simpleStringBufferDecoderWithThrowIfEndIsReached(
    isSMTP$EHLO_GREET$Char,
    buffer,
    index,
  );
}

function isSMTP$EHLO_GREET$Char(
  byte: u8,
): boolean {
  return (byte === 9)
    || ((32 <= byte) && (byte <= 126));
}

/* EHLO_LINE */

function smtp$EHLO_LINE$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ISMTP$EHLO_OK_RSP$PacketLine> {

  // keyword
  let keyword: ASCIIString;
  [index, keyword] = smtp$EHLO_KEYWORD$BufferDecoder(buffer, index);

  // params
  const params: ASCIIString[] = [];
  while (buffer[index] === CHAR_SPACE) {
    index++;
    // param
    let param: ASCIIString;
    [index, param] = smtp$EHLO_PARAM$BufferDecoder(buffer, index);
    params.push(param);
  }

  return [
    index,
    {
      keyword,
      params,
    },
  ];
}

/* EHLO_KEYWORD */

function smtp$EHLO_KEYWORD$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  return simpleStringBufferDecoderWithThrowIfEndIsReached(
    isSMTP$EHLO_KEYWORD$Char,
    buffer,
    index,
  );
}

function isSMTP$EHLO_KEYWORD$Char(
  byte: u8,
): boolean {
  return isAlphaNumericChar(byte)
    || (byte === CHAR_MINUS);
}

/* EHLO_PARAM */

function smtp$EHLO_PARAM$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  const result: IBufferDecoderResult<ASCIIString> = simpleStringBufferDecoderWithThrowIfEndIsReached(
    isSMTP$EHLO_PARAM$Char,
    buffer,
    index,
  );

  if (result[1].length === 0) {
    throw new Error(`Param can't be empty`);
  }

  return result;
}

function isSMTP$EHLO_PARAM$Char(
  byte: u8,
): boolean {
  return ((33 <= byte) && (byte <= 126));
}

