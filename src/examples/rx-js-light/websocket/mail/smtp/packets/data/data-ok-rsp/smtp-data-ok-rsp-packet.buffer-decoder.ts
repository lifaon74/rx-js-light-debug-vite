import { ISMTP$DATA_OK_RSP$Packet } from './smtp-data-ok-rsp-packet.type';
import { u32, u8 } from '@lifaon/number-types';
import { CHAR_5 } from '../../../../../chars/digits/5.constant';
import { CHAR_3 } from '../../../../../chars/digits/3.constant';
import { CHAR_4 } from '../../../../../chars/digits/4.constant';

import { CHAR_CR } from '../../../../../chars/CR.constant';
import { CHAR_LF } from '../../../../../chars/LF.constant';
import { IBufferDecoderResult } from '../../../../../encoding/types/buffer-decoder/buffer-decoder.type';
import { ASCIIString } from '../../../../classes/ascii-string/ascii-string.class';
import { bufferDecoderExpectsCRLF } from '../../../../../encoding/functions/buffer-decoder-expects-crlf';
import { smtp$Code$BufferDecoder } from '../../../shared/smtp-code.buffer-decoder';
import { simpleStringBufferDecoderWithThrowIfEndIsReached } from '../../../../../encoding/functions/simple-string.buffer-decoder';


export function smtp$DATA_OK_RSP$PacketBufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ISMTP$DATA_OK_RSP$Packet> {

  // code
  let hasNextLine: boolean;
  [index, hasNextLine] = smtp$DATA_OK_RSP_CODE$BufferDecoder(buffer, index);
  if (hasNextLine) {
    throw new Error(`Unexpected multi line response`);
  }

  // text
  let text: ASCIIString;
  [index, text] = smtp$DATA_OK_RSP_TEXT$BufferDecoder(buffer, index);

  // CRLF
  [index] = bufferDecoderExpectsCRLF(buffer, index);

  return [
    index,
    {
      text,
    },
  ];
}

/*---------------------*/

/* DATA_OK_RSP_CODE */

const DATA_OK_RSP_CODE = new Uint8Array([
  CHAR_3,
  CHAR_5,
  CHAR_4,
]);

function smtp$DATA_OK_RSP_CODE$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<boolean> {
  return smtp$Code$BufferDecoder(
    DATA_OK_RSP_CODE,
    buffer,
    index,
  );
}


/* DATA_OK_RSP_TEXT */

function smtp$DATA_OK_RSP_TEXT$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  return simpleStringBufferDecoderWithThrowIfEndIsReached(
    isSMTP$DATA_OK_RSP_TEXT$Char,
    buffer,
    index,
  );
}

function isSMTP$DATA_OK_RSP_TEXT$Char(
  byte: u8,
): boolean {
  return (byte !== CHAR_CR)
    && (byte !== CHAR_LF);
}


