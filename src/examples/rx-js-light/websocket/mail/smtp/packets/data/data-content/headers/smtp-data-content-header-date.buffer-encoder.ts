import { u32 } from '@lifaon/number-types';
import { CHAR_COLON } from '../../../../../../chars/colon.constant';
import { CHAR_D } from '../../../../../../chars/alpha/uppercase/D.constant';
import { CHAR_SPACE } from '../../../../../../chars/space.constant';
import { ASCIIString } from '../../../../../classes/ascii-string/ascii-string.class';
import { asciiStringBufferEncoder } from '../../../../../classes/ascii-string/functions/helpers/ascii-string.buffer-encoder';
import { CHAR_t } from '../../../../../../chars/alpha/lowercase/t.constant';
import { CHAR_a } from '../../../../../../chars/alpha/lowercase/a.constant';
import { CHAR_e } from '../../../../../../chars/alpha/lowercase/e.constant';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';
import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';

const DATE_HEADER_NAME = new Uint8Array([
  CHAR_D,
  CHAR_a,
  CHAR_t,
  CHAR_e,
  CHAR_COLON,
  CHAR_SPACE,
]);

export function smtpDataContentHeader$Date$BufferEncoder(
  date: Date,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = uint8ArrayBufferEncoder(
    DATE_HEADER_NAME,
    buffer,
    index,
  );


  index = asciiStringBufferEncoder(
    ASCIIString.fromSafeString(date.toString()),
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}
