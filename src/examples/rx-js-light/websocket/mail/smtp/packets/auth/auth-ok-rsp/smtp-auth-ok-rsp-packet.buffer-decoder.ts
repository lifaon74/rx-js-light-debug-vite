import { ISMTP$AUTH_OK_RSP$Packet } from './smtp-auth-ok-rsp-packet.type';
import { CHAR_3 } from '../../../../../chars/digits/3.constant';
import { u32, u8 } from '@lifaon/number-types';
import { CHAR_2 } from '../../../../../chars/digits/2.constant';
import { CHAR_5 } from '../../../../../chars/digits/5.constant';
import { CHAR_SPACE } from '../../../../../chars/space.constant';
import { isNumericChar } from '../../../../../chars/is/is-numeric-char';
import { CHAR_DOT } from '../../../../../chars/dot.constant';
import { simpleStringBufferDecoderWithThrowIfEndIsReached } from '../../../../../encoding/functions/simple-string.buffer-decoder';
import { CHAR_CR } from '../../../../../chars/CR.constant';
import { CHAR_LF } from '../../../../../chars/LF.constant';
import { ASCIIString } from '../../../../classes/ascii-string/ascii-string.class';
import { EMPTY_ASCII_STRING } from '../../../../classes/ascii-string/empty-ascii-string.constant';
import { smtp$Code$BufferDecoder } from '../../../shared/smtp-code.buffer-decoder';
import { bufferDecoderExpectsCRLF } from '../../../../../encoding/functions/buffer-decoder-expects-crlf';
import { IBufferDecoderResult } from '../../../../../encoding/types/buffer-decoder/buffer-decoder.type';
import { smtp$TextString$BufferDecoder } from '../../../shared/smtp-textstring.buffer-decoder';

// https://www.rfc-editor.org/rfc/rfc4954.txt

export function smtp$AUTH_OK_RSP$PacketBufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ISMTP$AUTH_OK_RSP$Packet> {

  // code
  let hasNextLine: boolean;
  [index, hasNextLine] = smtp$AUTH_OK_RSP_CODE$BufferDecoder(buffer, index);
  if (hasNextLine) {
    throw new Error(`Unexpected multi line response`);
  }

  // version
  let version: ASCIIString;
  [index, version] = smtp$AUTH_OK_RSP_VERSION$BufferDecoder(buffer, index);

  // text
  let text: ASCIIString;
  if (buffer[index] === CHAR_SPACE) {
    [index, text] = smtp$TextString$BufferDecoder(buffer, index + 1);
  } else {
    text = EMPTY_ASCII_STRING;
  }

  // CRLF
  [index] = bufferDecoderExpectsCRLF(buffer, index);

  return [
    index,
    {
      version,
      text,
    },
  ];
}

/*---------------------*/

/* AUTH_OK_RSP_CODE*/

const AUTH_OK_RSP_CODE = new Uint8Array([
  CHAR_2,
  CHAR_3,
  CHAR_5,
]);

function smtp$AUTH_OK_RSP_CODE$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<boolean> {
  return smtp$Code$BufferDecoder(
    AUTH_OK_RSP_CODE,
    buffer,
    index,
  );
}

/* AUTH_OK_RSP_VERSION */

function smtp$AUTH_OK_RSP_VERSION$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  return simpleStringBufferDecoderWithThrowIfEndIsReached(
    isSMTP$AUTH_OK_RSP_VERSION$Char,
    buffer,
    index,
  );
}

function isSMTP$AUTH_OK_RSP_VERSION$Char(
  byte: u8,
): boolean {
  return isNumericChar(byte)
    || (byte === CHAR_DOT);
}


/* AUTH_OK_RSP_TEXT */

function smtp$AUTH_OK_RSP_TEXT$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  return simpleStringBufferDecoderWithThrowIfEndIsReached(
    isSMTP$AUTH_OK_RSP_TEXT$Char,
    buffer,
    index,
  );
}

function isSMTP$AUTH_OK_RSP_TEXT$Char(
  byte: u8,
): boolean {
  return (byte !== CHAR_CR)
    && (byte !== CHAR_LF);
}


