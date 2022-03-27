import { ASCIIString } from '../ascii-string/ascii-string.class';
import { u32, u8 } from '@lifaon/number-types';
import { isHTTPTokenChar } from '../../../chars/is/http/is-http-token-char';
import { IBufferDecoderResult } from '../../../encoding/types/buffer-decoder/buffer-decoder.type';
import { simpleStringBufferDecoder } from '../../../encoding/functions/simple-string.buffer-decoder';
import { createInvalidMimeTypeError } from './functions/create-invalid-mime-type-error';
import { skipHTTPWhiteSpaces } from './functions/skip-http-white-spaces';
import { asciiStringToLowerCase } from '../ascii-string/functions/ascii-string-to-lower-case';
import { MimeTypeParameters, mimeTypeParametersBufferDecoder } from './mime-type-parameters.class';
import { CHAR_SLASH } from '../../../chars/slash.constant';
import { CHAR_SEMICOLON } from '../../../chars/semicolon.constant';


export class MimeType {

  /* FROM */

  static fromASCIIString(
    input: ASCIIString,
  ): MimeType {
    return mimeTypeBufferDecoder(
      input.chars,
      0,
    )[1];
  }

  static fromString(
    input: string,
  ): MimeType {
    return this.fromASCIIString(ASCIIString.fromUnsafeString(input));
  }


  /* CREATE */

  static createUnsafe(
    type: ASCIIString,
    subtype: ASCIIString,
    parameters: MimeTypeParameters,
  ): MimeType {
    return new MimeType(
      type,
      subtype,
      parameters,
    );
  }

  readonly type: ASCIIString;
  readonly subtype: ASCIIString;
  readonly parameters: MimeTypeParameters;

  protected constructor(
    type: ASCIIString,
    subtype: ASCIIString,
    parameters: MimeTypeParameters,
  ) {
    this.type = type;
    this.subtype = subtype;
    this.parameters = parameters;
  }


  toString(): string {
    return `${this.type.toString()}/${this.subtype.toString()}${this.parameters.toString()}`;
  }
}


/*----------------------------*/

export function mimeTypeBufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<MimeType> {
  index = skipHTTPWhiteSpaces(buffer, index);

  let type: ASCIIString;
  [index, type] = mimeType$TypeFull$BufferDecoder(buffer, index);

  let subtype: ASCIIString;
  [index, subtype] = mimeType$SubtypeFull$BufferDecoder(buffer, index);


  let parameters: MimeTypeParameters;
  [index, parameters] = mimeTypeParametersBufferDecoder(buffer, index);

  return [
    index,
    MimeType.createUnsafe(
      type,
      subtype,
      parameters,
    ),
  ];
}

/* MIME TYPE => TYPE */

function mimeType$TypeFull$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  let type: ASCIIString;
  [index, type] = mimeType$Type$BufferDecoder(buffer, index);

  if (
    (type.length === 0)
    || (index >= buffer.length)
    || (buffer[index] !== CHAR_SLASH)
  ) {
    throw createInvalidMimeTypeError('invalid type');
  } else {
    return [
      index + 1, // skip past "/"
      asciiStringToLowerCase(type),
    ];
  }
}

function mimeType$Type$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  return simpleStringBufferDecoder(
    isMimeType$Type$Char,
    buffer,
    index,
  );
}

function isMimeType$Type$Char(
  byte: u8,
): boolean {
  return isHTTPTokenChar(byte);
}

/* MIME TYPE => SUBTYPE */

function mimeType$SubtypeFull$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  let subtype: ASCIIString;
  [index, subtype] = mimeType$Subtype$BufferDecoder(buffer, index);

  index = skipHTTPWhiteSpaces(buffer, index);

  if (
    (subtype.length === 0)
    || (
      (index < buffer.length)
      && (buffer[index] !== CHAR_SEMICOLON)
    )
  ) {
    throw createInvalidMimeTypeError('invalid subtype');
  } else {
    return [
      index,
      // (index < buffer.length)
      //   ? (index + 1)  // skip past ";"
      //   : index,
      asciiStringToLowerCase(subtype),
    ];
  }
}

function mimeType$Subtype$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  return simpleStringBufferDecoder(
    isMimeType$Subtype$Char,
    buffer,
    index,
  );
}

function isMimeType$Subtype$Char(
  byte: u8,
): boolean {
  return isHTTPTokenChar(byte);
}
