import { u32 } from '@lifaon/number-types';

import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';
import { IReadonlyUTF8EncodedStringBuffer, stringToUTF8EncodedStringBuffer } from '@lirx/core';
import { smtpDataContentBody$Base64$BufferEncoder } from './shared/smtp-data-content-body-base64.buffer-encoder';

const TEXT_BODY_HEADERS = stringToUTF8EncodedStringBuffer('Content-Type: text/plain; charset=UTF-8\r\nContent-Transfer-Encoding: base64\r\n\r\n');


export function smtpDataContentBody$Text$BufferEncoder(
  text: IReadonlyUTF8EncodedStringBuffer,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    TEXT_BODY_HEADERS,
    buffer,
    index,
  );

  index = smtpDataContentBody$Base64$BufferEncoder(
    text,
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}
