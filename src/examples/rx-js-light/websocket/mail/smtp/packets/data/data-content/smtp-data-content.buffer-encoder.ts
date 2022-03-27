import { u32 } from '@lifaon/number-types';
import { IStringOrUTF8EncodedStringBuffer, IUTF8EncodedStringBuffer, toUTF8EncodedString } from '@lifaon/rx-js-light';
import { smtpDataContentHeader$To$BufferEncoder } from './headers/smtp-data-content-header-to.buffer-encoder';
import { EmailContact } from '../../../../classes/email-contact/email-contact.class';
import { EmailAddress } from '../../../../classes/email-address/email-address.class';
import { IEmailAddressLike } from '../../../../classes/email-address-like/email-address-like.type';
import { smtpDataContentHeader$Cc$BufferEncoder } from './headers/smtp-data-content-header-cc.buffer-encoder';
import { smtpDataContentHeader$Bcc$BufferEncoder } from './headers/smtp-data-content-header-bcc.buffer-encoder';
import { smtpDataContentHeader$From$BufferEncoder } from './headers/smtp-data-content-header-from.buffer-encoder';
import {
  smtpDataContentHeader$ReplyTo$BufferEncoder,
} from './headers/smtp-data-content-header-reply-to.buffer-encoder';
import { smtpDataContentHeader$Sender$BufferEncoder } from './headers/smtp-data-content-header-sender.buffer-encoder';
import { MessageId } from '../../../../classes/message-id/message-id.class';
import {
  smtpDataContentHeader$MessageId$BufferEncoder,
} from './headers/smtp-data-content-header-message-id.buffer-encoder';
import {
  smtpDataContentHeader$InReplyTo$BufferEncoder,
} from './headers/smtp-data-content-header-in-reply-to.buffer-encoder';
import {
  smtpDataContentHeader$References$BufferEncoder,
} from './headers/smtp-data-content-header-references.buffer-encoder';
import { ASCIIString } from '../../../../classes/ascii-string/ascii-string.class';
import { smtpDataContentHeader$Subject$BufferEncoder } from './headers/smtp-data-content-header-subject.buffer-encoder';
import {
  smtpDataContentHeader$MimeVersion1$BufferEncoder,
} from './headers/smtp-data-content-header-mime-version-1.buffer-encoder';
import { smtpDataContentBody$Text$BufferEncoder } from './body/smtp-data-content-body-text.buffer-encoder';
import {
  emailAddressLikeToEmailAddress,
} from '../../../../classes/email-address-like/email-address-like-to-email-address';
import { EmailAttachment } from '../../../../classes/email-attachment/email-attachment.class';
import { smtpDataContentBody$Multipart$BufferEncoder } from './body/smtp-data-content-body-multipart.buffer-encoder';
import { MULTIPART_ALTERNATIVE } from './headers/content-type/multipart-alternative.constant';
import { smtpDataContentBody$HTML$BufferEncoder } from './body/smtp-data-content-body-html.buffer-encoder';
import { MULTIPART_MIXED } from './headers/content-type/multipart-mixed.constant';
import { smtpDataContentBody$Attachment$BufferEncoder } from './body/smtp-data-content-body-attachment.buffer-encoder';
import { createStaticBufferEncoder } from '../../../../../encoding/types/buffer-encoder/create-static-buffer-encoder';
import { IStaticBufferEncoder } from '../../../../../encoding/types/buffer-encoder/static-buffer-encoder';


export type IEmailAddressListLike =
  | IEmailAddressLike
  | Iterable<IEmailAddressLike>
  ;

export function emailAddressListLikeToEmailAddressBufferList(
  input: IEmailAddressListLike,
): IEmailAddressLike[] {
  if (Array.isArray(input)) {
    return input;
  } else if (
    (input instanceof EmailAddress)
    || (input instanceof EmailContact)
  ) {
    return [
      input,
    ];
  } else {
    return Array.from(input);
  }
}

export interface ISMTPDataContentOptionsLike {
  date?: Date | number; // (default: current date)

  from: IEmailAddressListLike;
  sender?: IEmailAddressLike;
  replyTo?: IEmailAddressListLike;

  to: IEmailAddressListLike;
  cc?: IEmailAddressListLike;
  bcc?: IEmailAddressListLike;

  messageId?: MessageId;
  inReplyTo?: Iterable<MessageId>;
  references?: Iterable<MessageId>;

  subject: ASCIIString;

  text: IStringOrUTF8EncodedStringBuffer;
  html?: IStringOrUTF8EncodedStringBuffer;
  attachments?: Iterable<EmailAttachment>;
}

export function prepareSMTPDataContentOptions(
  {
    date = new Date(),
    from,
    sender,
    replyTo = [],
    to,
    cc = [],
    bcc = [],
    messageId,
    inReplyTo = [],
    references = [],
    subject,
    text,
    html,
    attachments = [],
  }: ISMTPDataContentOptionsLike,
): ISMTPDataContentOptions {
  const _date: Date = (typeof date === 'number')
    ? new Date(date)
    : date;

  const _from: ArrayLike<IEmailAddressLike> = emailAddressListLikeToEmailAddressBufferList(from);
  if (_from.length === 0) {
    throw new Error(`'from' cannot be empty`);
  }

  const _sender: IEmailAddressLike = (sender === void 0)
    ? _from[0]
    : sender;

  const senderAddress: EmailAddress = emailAddressLikeToEmailAddress(_sender);

  const _replyTo: ArrayLike<IEmailAddressLike> = emailAddressListLikeToEmailAddressBufferList(replyTo);

  const _to: ArrayLike<IEmailAddressLike> = emailAddressListLikeToEmailAddressBufferList(to);
  const _cc: ArrayLike<IEmailAddressLike> = emailAddressListLikeToEmailAddressBufferList(cc);
  const _bcc: ArrayLike<IEmailAddressLike> = emailAddressListLikeToEmailAddressBufferList(bcc);

  const _messageId: MessageId = (messageId === void 0)
    ? MessageId.generate(senderAddress.domain)
    : messageId;

  const _inReplyTo: ArrayLike<MessageId> = Array.isArray(inReplyTo)
    ? inReplyTo
    : Array.from(inReplyTo);

  const _references: ArrayLike<MessageId> = Array.isArray(references)
    ? references
    : Array.from(references);

  const _text: IUTF8EncodedStringBuffer = toUTF8EncodedString(text);

  const _html: IUTF8EncodedStringBuffer | null = (html === void 0)
    ? null
    : toUTF8EncodedString(html);

  const _attachments: ArrayLike<EmailAttachment> = Array.isArray(attachments)
    ? attachments
    : Array.from(attachments);

  return {
    date: _date,
    from: _from,
    sender: _sender,
    replyTo: _replyTo,
    to: _to,
    cc: _cc,
    bcc: _bcc,
    messageId: _messageId,
    inReplyTo: _inReplyTo,
    references: _references,
    subject,
    text: _text,
    html: _html,
    attachments: _attachments,
  };
}

/*-----------------------------*/

export interface ISMTPDataContentOptions {
  date: Date;

  from: ArrayLike<IEmailAddressLike>;
  sender: IEmailAddressLike;
  replyTo: ArrayLike<IEmailAddressLike>;

  to: ArrayLike<IEmailAddressLike>;
  cc: ArrayLike<IEmailAddressLike>;
  bcc: ArrayLike<IEmailAddressLike>;

  messageId: MessageId;
  inReplyTo: ArrayLike<MessageId>;
  references: ArrayLike<MessageId>;

  subject: ASCIIString;
  // comments: ASCIIString; // TODO
  // keywords: any; // TODO
  // TODO resent fields
  // TODO trace fields
  // TODO optional fields

  text: IUTF8EncodedStringBuffer;
  html: IUTF8EncodedStringBuffer | null;
  attachments: ArrayLike<EmailAttachment>;
}

export function smtp$DataContent$BufferEncoder(
  {
    date,
    from,
    sender,
    replyTo,
    to,
    cc,
    bcc,
    messageId,
    inReplyTo,
    references,
    subject,
    text,
    html,
    attachments,
  }: ISMTPDataContentOptions,
  buffer: Uint8Array,
  index: u32,
): u32 {

  // rfc2822

  index = smtpDataContentHeader$From$BufferEncoder(from, buffer, index);
  index = smtpDataContentHeader$Sender$BufferEncoder(sender, from, buffer, index);
  index = smtpDataContentHeader$ReplyTo$BufferEncoder(replyTo, buffer, index);

  index = smtpDataContentHeader$To$BufferEncoder(to, buffer, index);
  index = smtpDataContentHeader$Cc$BufferEncoder(cc, buffer, index);
  index = smtpDataContentHeader$Bcc$BufferEncoder(bcc, buffer, index);

  index = smtpDataContentHeader$MessageId$BufferEncoder(messageId, buffer, index);
  index = smtpDataContentHeader$InReplyTo$BufferEncoder(inReplyTo, buffer, index);
  index = smtpDataContentHeader$References$BufferEncoder(references, buffer, index);

  index = smtpDataContentHeader$Subject$BufferEncoder(subject, buffer, index);

  // rfc2045

  index = smtpDataContentHeader$MimeVersion1$BufferEncoder(buffer, index);

  const encodeText = (
    buffer: Uint8Array,
    index: u32,
  ): u32 => {
    return smtpDataContentBody$Text$BufferEncoder(text, buffer, index);
  };

  const encodeHTML = (
    buffer: Uint8Array,
    index: u32,
  ): u32 => {
    if (html === null) {
      throw new Error(`Empty HTML`);
    } else {
      return smtpDataContentBody$HTML$BufferEncoder(html, buffer, index);
    }
  };

  const encodeTextAndHTML = (
    buffer: Uint8Array,
    index: u32,
  ): u32 => {
    return smtpDataContentBody$Multipart$BufferEncoder(
      {
        kind: MULTIPART_ALTERNATIVE,
        encoders: [
          encodeText,
          encodeHTML,
        ],
      },
      buffer,
      index,
    );
  };

  const createAttachment = (
    buffer: Uint8Array,
    index: u32,
  ): u32 => {
    return smtpDataContentBody$Multipart$BufferEncoder(
      {
        kind: MULTIPART_ALTERNATIVE,
        encoders: [
          encodeText,
          encodeHTML,
        ],
      },
      buffer,
      index,
    );
  };

  const encodeTextAndAttachments = (
    buffer: Uint8Array,
    index: u32,
  ): u32 => {
    return smtpDataContentBody$Multipart$BufferEncoder(
      {
        kind: MULTIPART_MIXED,
        encoders: [
          encodeText,
          ...Array.from(attachments).map((attachment: EmailAttachment): IStaticBufferEncoder => {
            return createStaticBufferEncoder(smtpDataContentBody$Attachment$BufferEncoder, attachment);
          }),
        ],
      },
      buffer,
      index,
    );
  };

  if (html === null) {
    if (attachments.length === 0) { // text only
      index = encodeText(buffer, index);
    } else { // text & attachments
      index = encodeTextAndAttachments(buffer, index);
    }
  } else {
    if (attachments.length === 0) { // text & html
      index = encodeTextAndHTML(
        buffer,
        index,
      );
    } else { // html, text & attachments

    }
  }

  return index;
}


