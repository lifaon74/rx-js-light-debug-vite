import { u32 } from '@lifaon/number-types';
import { ISMTPDataContentOptions, smtp$DataContent$BufferEncoder } from './smtp-data-content.buffer-encoder';
import { CHAR_CR } from '../../../../../chars/CR.constant';
import { CHAR_LF } from '../../../../../chars/LF.constant';
import { CHAR_DOT } from '../../../../../chars/dot.constant';
import { uint8ArrayBufferEncoder } from '../../../../../array-buffer/uint8-array.buffer-encoder';


const DATA_CONTENT_ENDING_SEQUENCE_CHARS = new Uint8Array([
  CHAR_CR,
  CHAR_LF,
  CHAR_DOT,
  CHAR_CR,
  CHAR_LF,
]);


export function smtp$DataContentWithEndingSequence$BufferEncoder(
  options: ISMTPDataContentOptions,
  buffer: Uint8Array,
  index: u32,
): u32 {
  index = smtp$DataContent$BufferEncoder(options, buffer, index);

  index = uint8ArrayBufferEncoder(
    DATA_CONTENT_ENDING_SEQUENCE_CHARS,
    buffer,
    index,
  );

  return index;
}


