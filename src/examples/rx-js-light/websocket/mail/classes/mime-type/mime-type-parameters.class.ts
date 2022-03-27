import { ASCIIString } from '../ascii-string/ascii-string.class';
import { u32, u8 } from '../../../../../../../../number-types/dist';
import { IBufferDecoderResult } from '../../../encoding/types/buffer-decoder/buffer-decoder.type';
import { skipHTTPWhiteSpaces } from './functions/skip-http-white-spaces';
import { simpleStringBufferDecoder } from '../../../encoding/functions/simple-string.buffer-decoder';
import { isHTTPTokenChar } from '../../../chars/is/http/is-http-token-char';
import { asciiStringToLowerCase } from '../ascii-string/functions/ascii-string-to-lower-case';
import { createInvalidMimeTypeParameterError } from './functions/create-invalid-mime-type-parameter-error';
import { isHTTPQuotedStringTokenChar } from '../../../chars/is/http/is-http-quoted-string-token-char';
import { EMPTY_ASCII_STRING } from '../ascii-string/empty-ascii-string.constant';
import { createExpectedByteError } from '../../../errors/expected-byte/expected-byte-error';
import { CHAR_DOUBLE_QUOTE } from '../../../chars/double-quote.constant';
import { isHTTPWhiteSpaceChar } from '../../../chars/is/http/is-http-white-space-char';
import { CHAR_EQUAL } from '../../../chars/equal.constant';
import { CHAR_SEMICOLON } from '../../../chars/semicolon.constant';
import { CHAR_BACKSLASH } from '../../../chars/backslash.constant';
import { IASCIIString } from '../../../misc/ascii-string/ascii-string.type';

export type IMimeTypeParametersEntry = [
  key: ASCIIString,
  value: ASCIIString,
];

export class MimeTypeParameters {

  /* FROM */

  static fromASCIIString(
    input: IASCIIString,
  ): MimeTypeParameters {
    return mimeTypeParametersBufferDecoder(
      input.chars,
      0,
    )[1];
  }

  static fromString(
    input: string,
  ): MimeTypeParameters {
    return this.fromASCIIString(ASCIIString.fromUnsafeString(input));
  }

  /* CREATE */

  static createUnsafe(
    parameters: Map<string, IMimeTypeParametersEntry>,
  ): MimeTypeParameters {
    return new MimeTypeParameters(
      parameters,
    );
  }

  protected readonly parameters: Map<string, IMimeTypeParametersEntry>;

  protected constructor(
    parameters: Map<string, IMimeTypeParametersEntry>,
  ) {
    this.parameters = parameters;
  }

  get size(): number {
    return this.parameters.size;
  }


  has(
    key: string,
  ): boolean {
    return this.parameters.has(key);
  }

  get(
    key: string,
  ): ASCIIString | undefined {
    return this.parameters.get(key)?.[1];
  }

  getUnquoted(
    key: string,
  ): ASCIIString | undefined {
    const value: ASCIIString | undefined = this.get(key);

    return (value === void 0)
      ? void 0
      : ASCIIString.fromSafeString(
        value.toString().replace(new RegExp('\\\\([^\\x0a\\x0d])', 'g'), '$1').slice(1, -1),
      );
  }

  set(
    key: IASCIIString,
    value: IASCIIString,
  ): void {
    let keyString: string;
    let keyASCIIString: ASCIIString;

    if (typeof key === 'string') {
      keyString = key;
      keyASCIIString = ASCIIString.fromUnsafeString(key);
    } else {
      keyString = key.toString();
      keyASCIIString = key;
    }

    if (mimeTypeParameter$ValueFull$BufferDecoder(keyASCIIString.chars, 0)[0] !== keyASCIIString.chars.length) {
      throw createInvalidMimeTypeParameterError('invalid key');
    }

    const valueASCIIString: ASCIIString = (typeof value === 'string')
      ? ASCIIString.fromUnsafeString(value)
      : value;

    if (mimeTypeParameter$ValueFull$BufferDecoder(valueASCIIString.chars, 0)[0] !== valueASCIIString.chars.length) {
      throw createInvalidMimeTypeParameterError('invalid value');
    }

    this.parameters.set(
      keyString,
      [
        keyASCIIString,
        valueASCIIString,
      ],
    );
  }

  setQuoted(
    key: IASCIIString,
    value: IASCIIString,
  ): void {
    this.set(
      key,
      `"${value.toString().replace(new RegExp('("|\\\\)', 'g'), '\\$1')}"`,
    );
  }

  toString(): string {
    let str: string = '';
    const iterator: Iterator<IMimeTypeParametersEntry> = this.parameters.values();
    let result: IteratorResult<IMimeTypeParametersEntry>;
    while (!(result = iterator.next()).done) {
      const [key, value] = result.value;
      str += `; ${key}${(value.length === 0) ? '' : `=${value}`}`;
    }
    return str;
  }

  entries(): IterableIterator<IMimeTypeParametersEntry> {
    return this.parameters.values();
  }

  [Symbol.iterator](): IterableIterator<IMimeTypeParametersEntry> {
    return this.entries();
  }
}


/*----------------------------*/

export function mimeTypeParametersBufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<MimeTypeParameters> {
  const parameters = new Map<string, IMimeTypeParametersEntry>();

  while (index < buffer.length) {
    if (buffer[index] === CHAR_SEMICOLON) {
      index++;
    } else {
      throw createExpectedByteError(CHAR_DOUBLE_QUOTE, buffer[index]);
    }

    let parameter: IMimeTypeParametersEntry;
    [index, parameter] = mimeTypeParameter$Parameter$BufferDecoder(buffer, index);
    parameters.set(
      parameter[0].toString(),
      parameter,
    );
  }

  return [
    index,
    MimeTypeParameters.createUnsafe(
      parameters,
    ),
  ];
}

/* MIME TYPE PARAMETER */

export function mimeTypeParameter$Parameter$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<IMimeTypeParametersEntry> {
  index = skipHTTPWhiteSpaces(buffer, index);

  let name: ASCIIString;
  [index, name] = mimeTypeParameter$NameFull$BufferDecoder(buffer, index);
  let value: ASCIIString;
  if (
    (index < buffer.length)
    && (buffer[index] === CHAR_EQUAL)
  ) {
    [index, value] = mimeTypeParameter$ValueFull$BufferDecoder(buffer, index + 1);
  } else {
    value = EMPTY_ASCII_STRING;
  }

  return [
    index,
    [
      name,
      value,
    ],
  ];
}


/* MIME TYPE PARAMETER => NAME */

function mimeTypeParameter$NameFull$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  let name: ASCIIString;
  [index, name] = mimeTypeParameter$Name$BufferDecoder(buffer, index);

  if (
    (name.length === 0)
    || (
      (index < buffer.length)
      && (buffer[index] !== CHAR_SEMICOLON)
      && (buffer[index] !== CHAR_EQUAL)
    )
  ) {
    throw createInvalidMimeTypeParameterError('invalid name');
  } else {
    return [
      index,
      asciiStringToLowerCase(name),
    ];
  }
}

function mimeTypeParameter$Name$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  return simpleStringBufferDecoder(
    isMimeTypeParameter$Name$Char,
    buffer,
    index,
  );
}

function isMimeTypeParameter$Name$Char(
  byte: u8,
): boolean {
  return isHTTPTokenChar(byte);
  // return (byte !== 0x3b) // ";"
  //   && (byte !== 0x3d)  // "="
  //   && isHTTPTokenChar(byte);
}


/* MIME TYPE PARAMETER => VALUE */

function mimeTypeParameter$ValueFull$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  let value: ASCIIString;

  if (buffer[index] === CHAR_DOUBLE_QUOTE) {
    [index, value] = mimeTypeParameter$QuotedValue$BufferDecoder(buffer, index);
    // remove trailing chars
    while (
      (index < buffer.length)
      && (buffer[index] !== CHAR_SEMICOLON)
      ) {
      index++;
    }
  } else {
    [index, value] = mimeTypeParameter$Value$BufferDecoder(buffer, index);
    // remove trailing white spaces
    let i: u32 = value.chars.length - 1;
    while (
      (i >= 0)
      && isHTTPWhiteSpaceChar(value.chars[i])
      ) {
      i--;
    }

    if (i !== (value.chars.length - 1)) {
      value = (i === -1)
        ? EMPTY_ASCII_STRING
        : ASCIIString.fromSafeBuffer(value.chars.subarray(0, i));
    }
  }

  if (
    (value.length === 0)
    || (
      (index < buffer.length)
      && (buffer[index] !== CHAR_SEMICOLON)
    )
  ) {
    throw createInvalidMimeTypeParameterError('invalid value');
  } else {
    return [
      index,
      asciiStringToLowerCase(value),
    ];
  }
}

function mimeTypeParameter$Value$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  return simpleStringBufferDecoder(
    isMimeTypeParameter$Value$Char,
    buffer,
    index,
  );
}

export function mimeTypeParameter$QuotedValue$BufferDecoder(
  buffer: Uint8Array,
  index: u32,
): IBufferDecoderResult<ASCIIString> {
  const start: number = index;

  if (buffer[index] === CHAR_DOUBLE_QUOTE) {
    index++;
  } else {
    throw createExpectedByteError(CHAR_DOUBLE_QUOTE, buffer[index]);
  }

  while (
    (index < buffer.length)
    && (
      (buffer[index] === CHAR_DOUBLE_QUOTE)
        ? (buffer[index - 1] === CHAR_BACKSLASH)
        : isHTTPQuotedStringTokenChar(buffer[index])
    )
    ) {
    index++;
  }

  if (index >= buffer.length) {
    throw new Error(`Missing closing double quote`);
  }

  if (buffer[index] === CHAR_DOUBLE_QUOTE) {
    index++;
  } else {
    throw createExpectedByteError(CHAR_DOUBLE_QUOTE, buffer[index]);
  }

  return [
    index,
    ASCIIString.fromSafeBuffer(buffer.subarray(start, index)),
  ];
}

function isMimeTypeParameter$Value$Char(
  byte: u8,
): boolean {
  return isHTTPTokenChar(byte);
}
