import { EmailMessageHeader } from '../email-message-header.class';
import { u32 } from '@lifaon/number-types';
import { ensureUint8ArrayHasEnoughSpace } from '../../../../../array-buffer/ensure-uint8-array-has-enough-space';
import { CHAR_COLON } from '../../../../../chars/colon.constant';
import { CHAR_SPACE } from '../../../../../chars/space.constant';
import { ASCIIString } from '../../../ascii-string/ascii-string.class';
import { trimShallowASCIIString } from '../../../ascii-string/functions/trim-ascii-string';
import { asciiStringBufferEncoder } from '../../../ascii-string/functions/helpers/ascii-string.buffer-encoder';


export class EmailMessageHeaderGeneric extends EmailMessageHeader {
  readonly key: ASCIIString;
  readonly value: ASCIIString;

  constructor(
    key: ASCIIString,
    value: ASCIIString,
  ) {
    super();
    this.key = trimShallowASCIIString(key);
    this.value = trimShallowASCIIString(value);
  }

  override encodeInBuffer(
    buffer: Uint8Array,
    index: u32,
  ): u32 {
    index = asciiStringBufferEncoder(
      this.key,
      buffer,
      index,
    );

    ensureUint8ArrayHasEnoughSpace(
      buffer,
      index,
      2,
    );

    buffer[index++] = CHAR_COLON;
    buffer[index++] = CHAR_SPACE;

    index = asciiStringBufferEncoder(
      this.value,
      buffer,
      index,
    );

    return index;
  }
}



