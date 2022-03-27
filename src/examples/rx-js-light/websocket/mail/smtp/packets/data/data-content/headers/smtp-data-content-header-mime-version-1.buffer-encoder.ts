import { u32 } from '@lifaon/number-types';
import { CHAR_COLON } from '../../../../../../chars/colon.constant';
import { CHAR_SPACE } from '../../../../../../chars/space.constant';
import { uint8ArrayBufferEncoder } from '../../../../../../array-buffer/uint8-array.buffer-encoder';
import { CHAR_MINUS } from '../../../../../../chars/minus.constant';
import { CHAR_s } from '../../../../../../chars/alpha/lowercase/s.constant';
import { CHAR_r } from '../../../../../../chars/alpha/lowercase/r.constant';
import { CHAR_E } from '../../../../../../chars/alpha/uppercase/E.constant';
import { CHAR_e } from '../../../../../../chars/alpha/lowercase/e.constant';
import { CHAR_I } from '../../../../../../chars/alpha/uppercase/I.constant';
import { CHAR_M } from '../../../../../../chars/alpha/uppercase/M.constant';
import { CHAR_V } from '../../../../../../chars/alpha/uppercase/V.constant';
import { CHAR_o } from '../../../../../../chars/alpha/lowercase/o.constant';
import { CHAR_n } from '../../../../../../chars/alpha/lowercase/n.constant';
import { CHAR_i } from '../../../../../../chars/alpha/lowercase/i.constant';
import { CHAR_DOT } from '../../../../../../chars/dot.constant';
import { CHAR_1 } from '../../../../../../chars/digits/1.constant';
import { CHAR_0 } from '../../../../../../chars/digits/0.constant';
import { CHAR_CR } from '../../../../../../chars/CR.constant';
import { CHAR_LF } from '../../../../../../chars/LF.constant';

const MIME_VERSION_1_HEADER_NAME = new Uint8Array([
  CHAR_M,
  CHAR_I,
  CHAR_M,
  CHAR_E,
  CHAR_MINUS,
  CHAR_V,
  CHAR_e,
  CHAR_r,
  CHAR_s,
  CHAR_i,
  CHAR_o,
  CHAR_n,
  CHAR_COLON,
  CHAR_SPACE,
  CHAR_1,
  CHAR_DOT,
  CHAR_0,
  CHAR_CR,
  CHAR_LF,
]);

export function smtpDataContentHeader$MimeVersion1$BufferEncoder(
  buffer: Uint8Array,
  index: u32,
): u32 {
  return uint8ArrayBufferEncoder(
    MIME_VERSION_1_HEADER_NAME,
    buffer,
    index,
  );
}

