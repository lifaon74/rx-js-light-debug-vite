import { u32 } from '@lifaon/number-types';

import { stringToUTF8EncodedStringBuffer } from '@lifaon/rx-js-light';
import { Boundary } from '../../../../../../classes/boundary/boundary.class';
import { asciiStringBufferEncoder } from '../../../../../../classes/ascii-string/functions/helpers/ascii-string.buffer-encoder';
import { ensureUint8ArrayHasEnoughSpace } from '../../../../../../../array-buffer/ensure-uint8-array-has-enough-space';
import { CHAR_DOUBLE_QUOTE } from '../../../../../../../chars/double-quote.constant';
import { crlfBufferEncoder } from '../../../../../../../encoding/functions/crlf.buffer-encoder';
import { uint8ArrayBufferEncoder } from '../../../../../../../array-buffer/uint8-array.buffer-encoder';
import { ASCIIString } from '../../../../../../classes/ascii-string/ascii-string.class';


const CONTENT_TYPE_MULTIPART_HEADER_PART_0 = stringToUTF8EncodedStringBuffer('Content-Type: multipart/');
const CONTENT_TYPE_MULTIPART_HEADER_PART_1 = stringToUTF8EncodedStringBuffer(';\r\n boundary="');

export interface ISMTPDataContentHeader$ContentTypeMultipart$BufferEncoderOptions {
  kind: ASCIIString;
  boundary: Boundary;
}

export function smtpDataContentHeader$ContentTypeMultipart$BufferEncoder(
  {
    kind,
    boundary,
  }: ISMTPDataContentHeader$ContentTypeMultipart$BufferEncoderOptions,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    CONTENT_TYPE_MULTIPART_HEADER_PART_0,
    buffer,
    index,
  );

  index = asciiStringBufferEncoder(
    kind,
    buffer,
    index,
  );

  index = uint8ArrayBufferEncoder(
    CONTENT_TYPE_MULTIPART_HEADER_PART_1,
    buffer,
    index,
  );

  index = asciiStringBufferEncoder(
    boundary.value,
    buffer,
    index,
  );

  ensureUint8ArrayHasEnoughSpace(
    buffer,
    index,
    1, // "
  );

  buffer[index++] = CHAR_DOUBLE_QUOTE;

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}


