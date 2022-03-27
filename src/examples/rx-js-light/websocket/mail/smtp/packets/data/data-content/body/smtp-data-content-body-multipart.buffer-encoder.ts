import { u32 } from '@lifaon/number-types';

import { crlfBufferEncoder } from '../../../../../../encoding/functions/crlf.buffer-encoder';
import {
  smtpDataContentHeader$ContentTypeMultipart$BufferEncoder,
} from '../headers/content-type/smtp-data-content-header-content-type-multipart.buffer-encoder';
import { Boundary } from '../../../../../classes/boundary/boundary.class';
import { asciiStringBufferEncoder } from '../../../../../classes/ascii-string/functions/helpers/ascii-string.buffer-encoder';
import { ASCIIString } from '../../../../../classes/ascii-string/ascii-string.class';
import { ensureUint8ArrayHasEnoughSpace } from '../../../../../../array-buffer/ensure-uint8-array-has-enough-space';
import { CHAR_MINUS } from '../../../../../../chars/minus.constant';
import { IStaticBufferEncoder } from '../../../../../../encoding/types/buffer-encoder/static-buffer-encoder';


export interface ISMTPDataContentBody$Multipart$BufferEncoderOptions {
  kind: ASCIIString;
  encoders: ArrayLike<IStaticBufferEncoder>;
}

export function smtpDataContentBody$Multipart$BufferEncoder(
  {
    kind,
    encoders,
  }: ISMTPDataContentBody$Multipart$BufferEncoderOptions,
  buffer: Uint8Array,
  index: u32,
): u32 {

  const boundary: Boundary = Boundary.generate();

  index = smtpDataContentHeader$ContentTypeMultipart$BufferEncoder(
    {
      kind,
      boundary,
    },
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  for (let i = 0, l = encoders.length; i < l; i++) {
    const encoder: IStaticBufferEncoder = encoders[i];

    index = minusMinusBufferEncoder(
      buffer,
      index,
    );

    index = asciiStringBufferEncoder(
      boundary.value,
      buffer,
      index,
    );

    index = crlfBufferEncoder(
      buffer,
      index,
    );

    index = encoder(buffer, index);
  }

  index = minusMinusBufferEncoder(
    buffer,
    index,
  );

  index = asciiStringBufferEncoder(
    boundary.value,
    buffer,
    index,
  );

  index = minusMinusBufferEncoder(
    buffer,
    index,
  );

  index = crlfBufferEncoder(
    buffer,
    index,
  );

  return index;
}


function minusMinusBufferEncoder(
  buffer: Uint8Array,
  index: u32,
): u32 {
  ensureUint8ArrayHasEnoughSpace(
    buffer,
    index,
    2, // --
  );

  buffer[index++] = CHAR_MINUS;
  buffer[index++] = CHAR_MINUS;

  return index;
}
