import { ISMTP$GREETING$Packet } from './smtp-greeting-packet.type';
import { u32 } from '@lifaon/number-types';
import { CHAR_2 } from '../../../../chars/digits/2.constant';
import { CHAR_0 } from '../../../../chars/digits/0.constant';
import { CHAR_SPACE } from '../../../../chars/space.constant';
import { smtp$Domain$BufferDecoder } from '../../shared/smtp-domain.buffer-decoder';
import { smtp$TextString$BufferDecoder } from '../../shared/smtp-textstring.buffer-decoder';
import { ASCIIString } from '../../../classes/ascii-string/ascii-string.class';
import { EMPTY_ASCII_STRING } from '../../../classes/ascii-string/empty-ascii-string.constant';
import { smtp$Code$BufferDecoder } from '../../shared/smtp-code.buffer-decoder';
import { bufferDecoderExpectsCRLF } from '../../../../encoding/functions/buffer-decoder-expects-crlf';
import { Domain } from '../../../classes/domain/domain.class';
import { IBufferDecoderResult } from '../../../../encoding/types/buffer-decoder/buffer-decoder.type';

// https://datatracker.ietf.org/doc/html/rfc5321#section-4.2


export function smtp$GREETING$PacketBufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ISMTP$GREETING$Packet> {

  // code
  let hasNextLine: boolean;
  [index, hasNextLine] = smtp$GREETING_CODE$BufferDecoder(buffer, index);

  // TODO support hasNextLine

  // domain
  let domain: Domain;
  [index, domain] = smtp$Domain$BufferDecoder(buffer, index);

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
      domain,
      text,
    },
  ];
}

/*---------------------*/

const GREETING_CODE = new Uint8Array([
  CHAR_2,
  CHAR_2,
  CHAR_0,
]);

function smtp$GREETING_CODE$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<boolean> {
  return smtp$Code$BufferDecoder(
    GREETING_CODE,
    buffer,
    index,
  );
}
