import { ASCIIString } from '../ascii-string/ascii-string.class';
import { MimeType } from '../mime-type/mime-type.class';

export class EmailAttachment {
  /* FROM */

  static fromBlob(
    blob: Blob,
    name: string | ASCIIString,
  ): Promise<EmailAttachment> {
    return blob.arrayBuffer()
      .then((buffer: ArrayBuffer): EmailAttachment => {
        return new EmailAttachment(
          (typeof name === 'string')
            ? ASCIIString.fromUnsafeString(name)
            : name,
          MimeType.fromString(blob.type),
          new Uint8Array(buffer),
        );
      });
  }

  static fromFile(
    file: File,
  ): Promise<EmailAttachment> {
    return this.fromBlob(file, file.name);
  }

  readonly name: ASCIIString;
  readonly type: MimeType;
  readonly content: Uint8Array;

  constructor(
    name: ASCIIString,
    type: MimeType,
    content: Uint8Array,
  ) {
    this.name = name;
    this.type = type;
    this.content = content;
  }
}
