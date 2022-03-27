import { EmailMessageHeader } from '../email-message-header.class';
import { u32 } from '@lifaon/number-types';
import { ensureUint8ArrayHasEnoughSpace } from '../../../../../array-buffer/ensure-uint8-array-has-enough-space';
import { CHAR_COLON } from '../../../../../chars/colon.constant';
import { CHAR_SPACE } from '../../../../../chars/space.constant';
import { MimeType } from '../../../mime-type/mime-type.class';


export class EmailMessageHeaderContentType extends EmailMessageHeader {
  readonly type: MimeType;

  constructor(
    type: MimeType,
  ) {
    super();
    this.type = type;
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



