import {
  createWebSocketByteStream, IByteStream, IByteStreamObservable, IObservable, IWebSocketByteStreamObservable, map$$,
  noop,
  notificationObserver, stringToUTF8EncodedStringBuffer,
} from '@lifaon/rx-js-light';
import { SMTP_CONFIG } from './mail/smtp/config.constant';
import { smtp$GREETING$PacketBufferDecoder } from './mail/smtp/packets/greeting/smtp-greeting-packet.buffer-decoder';
import { IBufferDecoder, IBufferDecoderResult } from './encoding/types/buffer-decoder/buffer-decoder.type';
import { createCircularUint8Array, ICircularUint8Array } from './array-buffer/circular-buffer/circular-buffer';
import { ISMTP$GREETING$Packet } from './mail/smtp/packets/greeting/smtp-greeting-packet.type';
import {
  circularUint8ArrayObservable, ICircularUint8ArrayObservableNotifications,
} from './array-buffer/circular-buffer/circular-buffer-observable';
import { IBufferEncoder } from './encoding/types/buffer-encoder/buffer-encoder.type';
import { smtp$EHLO$PacketBufferEncoder } from './mail/smtp/packets/ehlo/smtp-ehlo-packet.buffer-encoder';
import { ISMTP$EHLO_OK_RSP$Packet } from './mail/smtp/packets/ehlo/ehlo-ok-rsp/smtp-ehlo-ok-rsp-packet.type';
import {
  smtp$EHLO_OK_RSP$PacketBufferDecoder,
} from './mail/smtp/packets/ehlo/ehlo-ok-rsp/smtp-ehlo-ok-rsp-packet.buffer-decoder';
import {
  smtp$AUTH_LOGIN$PacketBufferEncoder,
} from './mail/smtp/packets/auth/login/auth-login/smtp-auth-login-packet.buffer-encoder';
import {
  smtp$AUTH_LOGIN_USERNAME_CHALLENGE$PacketBufferDecoder,
} from './mail/smtp/packets/auth/login/auth-login-username-challenge/smtp-auth-login-username-challenge-packet.buffer-decoder';
import {
  smtp$AUTH_LOGIN_PASSWORD_CHALLENGE$PacketBufferDecoder,
} from './mail/smtp/packets/auth/login/auth-login-password-challenge/smtp-auth-login-password-challenge-packet.buffer-decoder';
import {
  smtp$AUTH_LOGIN_USERNAME_RESPONSE$PacketBufferEncoder,
} from './mail/smtp/packets/auth/login/auth-login-username-response/smtp-auth-login-username-response-packet.buffer-encoder';
import {
  smtp$AUTH_LOGIN_PASSWORD_RESPONSE$PacketBufferEncoder,
} from './mail/smtp/packets/auth/login/auth-login-password-response/smtp-auth-login-password-response-packet.buffer-encoder';
import { ISMTP$AUTH_OK_RSP$Packet } from './mail/smtp/packets/auth/auth-ok-rsp/smtp-auth-ok-rsp-packet.type';
import {
  smtp$AUTH_OK_RSP$PacketBufferDecoder,
} from './mail/smtp/packets/auth/auth-ok-rsp/smtp-auth-ok-rsp-packet.buffer-decoder';
import { EmailAddress } from './mail/classes/email-address/email-address.class';
import { ASCIIString } from './mail/classes/ascii-string/ascii-string.class';
import {
  ISMTPDataContentOptions, prepareSMTPDataContentOptions, smtp$DataContent$BufferEncoder,
} from './mail/smtp/packets/data/data-content/smtp-data-content.buffer-encoder';
import { smtp$MAIL_FROM$PacketBufferEncoder } from './mail/smtp/packets/mail-from/smtp-mail-from-packet.buffer-encoder';
import { ISMTP$OK_RSP$Packet } from './mail/smtp/packets/ok-rsp/smtp-ok-rsp-packet.type';
import { smtp$OK_RSP$PacketBufferDecoder } from './mail/smtp/packets/ok-rsp/smtp-ok-rsp-packet.buffer-decoder';
import { smtp$RCPT_TO$PacketBufferEncoder } from './mail/smtp/packets/rcpt-to/smtp-rcpt-to-packet.buffer-encoder';
import { smtp$DATA$PacketBufferEncoder } from './mail/smtp/packets/data/smtp-data-packet.buffer-encoder';
import {
  smtp$DataContentWithEndingSequence$BufferEncoder
} from './mail/smtp/packets/data/data-content/smtp-data-content-with-ending-sequence.buffer-encoder';
import { emailAddressLikeToEmailAddress } from './mail/classes/email-address-like/email-address-like-to-email-address';
import { IEmailAddressLike } from './mail/classes/email-address-like/email-address-like.type';
import { isNotEnoughDataError } from './errors/not-enough-data/not-enough-data-error';
import { Domain } from './mail/classes/domain/domain.class';
import {
  smtp$DATA_OK_RSP$PacketBufferDecoder
} from './mail/smtp/packets/data/data-ok-rsp/smtp-data-ok-rsp-packet.buffer-decoder';
import { ISMTP$DATA_OK_RSP$Packet } from './mail/smtp/packets/data/data-ok-rsp/smtp-data-ok-rsp-packet.type';
import { EmailAttachment } from './mail/classes/email-attachment/email-attachment.class';
import { MimeType } from './mail/classes/mime-type/mime-type.class';

/*----------------------------------*/

const BUFFER_SIZE = 0x1000000; // 16MB

/*----------------------------------*/

export interface IConnectTLSOptions {
  port: number;
  hostname: string;
  caCerts?: string[];
}

function createRawSocketByteStream(
  options: IConnectTLSOptions,
): IWebSocketByteStreamObservable {
  const url = new URL(`ws://localhost:8081`);
  url.searchParams.set('config', JSON.stringify(options));

  return createWebSocketByteStream(url.href);
}

/*----------------------------------*/


function decodeCircularUint8ArrayObservable<GValue>(
  subscribe: IObservable<ICircularUint8ArrayObservableNotifications>,
  decoder: IBufferDecoder<GValue>,
): Promise<GValue> {
  return new Promise<GValue>((
    resolve: (value: GValue) => void,
    reject: (reason: any) => void,
  ): void => {
    subscribe(({ name, value }: ICircularUint8ArrayObservableNotifications): void => {
      switch (name) {
        case 'next': {
          try {
            const [index, _value]: IBufferDecoderResult<GValue> = decoder(
              value.readAll(false),
              0,
            );
            value.incrementReadIndex(index);
            resolve(_value);
          } catch (error: unknown) {
            if (!isNotEnoughDataError(error)) {
              reject(error);
            }
          }
          break;
        }
        case 'error': {
          reject(value);
          break;
        }
      }
    });
  });
}

function encode<GValue>(
  encoder: IBufferEncoder<GValue>,
  value: GValue,
): void {

}

export interface ISharedBufferEncoder {
  <GValue>(
    encoder: IBufferEncoder<GValue>,
    value: GValue,
  ): Uint8Array;
}

export function createSharedBufferEncoder(
  size: number,
): ISharedBufferEncoder {
  const buffer: Uint8Array = new Uint8Array(size);
  let encoding: boolean = false;

  return <GValue>(
    encoder: IBufferEncoder<GValue>,
    value: GValue,
  ): Uint8Array => {
    if (encoding) {
      throw new Error(`Already encoding`);
    } else {
      return buffer.subarray(0, encoder(value, buffer, 0));
    }
  };
}

/*----------------------------------*/

interface ICreateSMTPClientFromByteStreamOptions {
  stream$: IByteStreamObservable;
  hostname: string;
  username: string;
  password: string;
}

interface ISMTPClientSendFunction {
  (
    options: ISMTPDataContentOptions,
  ): Promise<void>;
}


interface ISMTPClientCloseFunction {
  (): Promise<void>;
}

interface ISMTPClient {
  send: ISMTPClientSendFunction;
  // close: ISMTPClientCloseFunction; // TODO
}


function createSMTPClientFromByteStream(
  {
    stream$,
    hostname,
    username,
    password,
  }: ICreateSMTPClientFromByteStreamOptions,
): Promise<ISMTPClient> {
  return new Promise<ISMTPClient>((
    resolve: (value: Promise<ISMTPClient>) => void,
    reject: (reason: any) => void,
  ): void => {
    const onOpen = ({ subscribe, emit }: IByteStream): void => {
      const input$ = map$$<ArrayBuffer, Uint8Array>(subscribe, _ => new Uint8Array(_));
      const inputBuffer$ = circularUint8ArrayObservable(input$, BUFFER_SIZE);
      const $output = emit;

      const sharedBufferEncoder = createSharedBufferEncoder(BUFFER_SIZE);

      const decode = <GValue>(
        decoder: IBufferDecoder<GValue>,
      ): Promise<GValue> => {
        return decodeCircularUint8ArrayObservable<GValue>(inputBuffer$, decoder);
      };


      const encode = <GValue>(
        encoder: IBufferEncoder<GValue>,
        value: GValue,
      ): Promise<void> => {
        return new Promise<void>((
          resolve: () => void,
        ): void => {
          $output(sharedBufferEncoder(encoder, value));
          resolve();
        });
      };

      input$((data: Uint8Array) => {
        console.log(ASCIIString.from(data).toString());
        // console.log(smtp$GREETING$PacketBufferDecoder(data, 0));
      });


      /* PRIVATE */

      // greeting
      const awaitGreeting = (): Promise<ISMTP$GREETING$Packet> => {
        return decode<ISMTP$GREETING$Packet>(smtp$GREETING$PacketBufferDecoder);
      };

      // EHLO
      const send$EHLO$ = (): Promise<void> => {
        return encode(smtp$EHLO$PacketBufferEncoder, { domain: Domain.from(hostname) });
      };

      const sendAndAwait$EHLO$ = (): Promise<ISMTP$EHLO_OK_RSP$Packet> => {
        return send$EHLO$()
          .then(() => {
            return decode<ISMTP$EHLO_OK_RSP$Packet>(smtp$EHLO_OK_RSP$PacketBufferDecoder);
          });
      };

      // AUTH LOGIN
      const send$AUTH_LOGIN$ = (): Promise<void> => {
        return encode(smtp$AUTH_LOGIN$PacketBufferEncoder, {});
      };

      const send$AUTH_LOGIN_USERNAME$ = (): Promise<void> => {
        return encode(smtp$AUTH_LOGIN_USERNAME_RESPONSE$PacketBufferEncoder, { username: ASCIIString.from(username) });
      };

      const send$AUTH_LOGIN_PASSWORD$ = (): Promise<void> => {
        return encode(smtp$AUTH_LOGIN_PASSWORD_RESPONSE$PacketBufferEncoder, { password: ASCIIString.from(password) });
      };

      const sendAndAwait$AUTH_LOGIN$ = (): Promise<ISMTP$AUTH_OK_RSP$Packet> => {
        return send$AUTH_LOGIN$()
          .then(() => {
            return decode<void>(smtp$AUTH_LOGIN_USERNAME_CHALLENGE$PacketBufferDecoder);
          })
          .then(() => {
            return send$AUTH_LOGIN_USERNAME$();
          })
          .then(() => {
            return decode<void>(smtp$AUTH_LOGIN_PASSWORD_CHALLENGE$PacketBufferDecoder);
          })
          .then(() => {
            return send$AUTH_LOGIN_PASSWORD$();
          })
          .then(() => {
            return decode<ISMTP$AUTH_OK_RSP$Packet>(smtp$AUTH_OK_RSP$PacketBufferDecoder);
          });
      };

      const performAuth = (): Promise<ISMTP$AUTH_OK_RSP$Packet> => {
        return sendAndAwait$AUTH_LOGIN$();
      };

      // // --> SEND

      // MAIL
      const send$MAIL_FROM$ = (
        from: IEmailAddressLike,
      ): Promise<void> => {
        return encode(smtp$MAIL_FROM$PacketBufferEncoder, { from: emailAddressLikeToEmailAddress(from) });
      };

      const sendAndAwait$MAIL_FROM$ = (
        from: IEmailAddressLike,
      ): Promise<ISMTP$OK_RSP$Packet> => {
        return send$MAIL_FROM$(from)
          .then(() => {
            return decode<ISMTP$OK_RSP$Packet>(smtp$OK_RSP$PacketBufferDecoder);
          });
      };

      // RCPT
      const send$RCPT_TO$ = (
        to: IEmailAddressLike,
      ): Promise<any> => {
        return encode(smtp$RCPT_TO$PacketBufferEncoder, { to: emailAddressLikeToEmailAddress(to) });
      };

      const sendAndAwait$RCPT_TO$ = (
        to: IEmailAddressLike,
      ): Promise<ISMTP$OK_RSP$Packet> => {
        return send$RCPT_TO$(to)
          .then(() => {
            return decode<ISMTP$OK_RSP$Packet>(smtp$OK_RSP$PacketBufferDecoder);
          });
      };

      const sendAndAwaitMultiple$RCPT_TO$ = (
        toList: ArrayLike<IEmailAddressLike>,
      ): Promise<any> => {
        return Array.from(toList)
          .reduce(
            (promise: Promise<any>, to: IEmailAddressLike): Promise<any> => {
              return promise
                .then(() => {
                  return sendAndAwait$RCPT_TO$(to);
                });
            },
            Promise.resolve(),
          );
      };

      // DATA
      const send$DATA$ = (): Promise<any> => {
        return encode(smtp$DATA$PacketBufferEncoder, null);
      };

      const sendAndAwait$DATA$ = (): Promise<ISMTP$DATA_OK_RSP$Packet> => {
        return send$DATA$()
          .then(() => {
            return decode<ISMTP$DATA_OK_RSP$Packet>(smtp$DATA_OK_RSP$PacketBufferDecoder);
          });
      };

      // DATA_CONTENT
      const send$DATA_CONTENT$ = (
        options: ISMTPDataContentOptions,
      ): Promise<any> => {
        return encode(smtp$DataContentWithEndingSequence$BufferEncoder, options);
      };

      const sendAndAwait$DATA_CONTENT$ = (
        options: ISMTPDataContentOptions,
      ): Promise<ISMTP$OK_RSP$Packet> => {
        return send$DATA_CONTENT$(options)
          .then(() => {
            return decode<ISMTP$OK_RSP$Packet>(smtp$OK_RSP$PacketBufferDecoder);
          });
      };

      /* PUBLIC */

      const connect = (): Promise<ISMTPClient> => {
        return awaitGreeting()
          .then(() => {
            console.log('greating done');
            return sendAndAwait$EHLO$();
          })
          .then(() => {
            return performAuth();
          })
          .then(() => {
            console.log('auth done');
            return {
              send,
            };
          });
      };

      const send = (
        options: ISMTPDataContentOptions,
      ): Promise<void> => {
        // return Promise.reject('TODO');
        return sendAndAwait$MAIL_FROM$(options.sender)
          .then(() => {
            return sendAndAwaitMultiple$RCPT_TO$(options.to);
          })
          .then(() => {
            return sendAndAwait$DATA$();
          })
          .then(() => {
            return sendAndAwait$DATA_CONTENT$(options);
          })
          .then(noop)
          ;
      };

      resolve(connect());
    };

    stream$(notificationObserver({
      open: onOpen,
      close: (event: unknown) => {
        reject(new (Error as any)(`Socket closed`, { cause: event }));
      },
      error: (error: unknown) => {
        reject(error);
      },
    }));
  });
}


/*----------------------------------*/


export function circularUint8ArrayExample1() {
  const buffer = createCircularUint8Array(4);

  const logBuffer = (buffer: ICircularUint8Array) => console.log(`readIndex: ${buffer.readIndex}, writeIndex: ${buffer.writeIndex}, readable: ${buffer.readable()}, writable: ${buffer.writable()}`);

  buffer.write(new Uint8Array([1, 2, 3]));
  logBuffer(buffer);
  console.log(buffer.read(2, true));
  logBuffer(buffer);
  buffer.write(new Uint8Array([4, 5, 6]));
  logBuffer(buffer);
  console.log(buffer.read(4, true));
  // console.log(buffer.readAll(true));
  logBuffer(buffer);
}


export function emailAddressExample1() {
  // const emailAddress = new EmailAddress('a@b.com');
  // const emailAddress = new EmailAddress('"John.\\"Doe."@example.com');
  const emailAddress = EmailAddress.from('valentin.richard@example.com');

  console.log(emailAddress);
}

export function asciiStringExample1() {
  const emailAddress = ASCIIString.fromSafeString('abc');

  console.log(emailAddress);
}

export function mimeTypeExample1() {
  // const type = MimeType.fromString('text/plain; charset=UTF-8; format=flowed');
  const type = MimeType.fromString('multipart/mixed; boundary="------------20f7c0nUPvZRtniUu0yqxVCY"');
  // const type = MimeType.fromString('attachment; filename="test.bin"');

  // type.parameters.set('a', '"b\\"');

  console.log(type);
  console.log(type.toString());
}

export function emailMessageExample1() {

}

export function smtpDataContent1(): ISMTPDataContentOptions {
  return prepareSMTPDataContentOptions({
    from: [
      EmailAddress.from('valentin.richard@infomaniak.com'),
    ],
    to: [
      EmailAddress.from('valentin.richard@infomaniak.com'),
      // new EmailAddress('valentin.richard+to@infomaniak.com'),
    ],
    subject: ASCIIString.from(`note #${Math.random()}`),
    // text: stringToUTF8EncodedStringBuffer(`content #${Math.random()}`),
    text: stringToUTF8EncodedStringBuffer(`
      Far far away, behind the word mountains, far from the countries Vokalia and Consonantia, there live the blind texts.
      Separated they live in Bookmarksgrove right at the coast of the Semantics, a large language ocean.
      A small river named Duden flows by their place and supplies it with the necessary regelialia.
      It is a paradisematic country, in which roasted parts of sentences fly into your mouth.
      Even the all-powerful Pointing has no control about the blind texts it is an almost unorthographic life.
      One day however a small line of blind text by the name of Lorem Ipsum decided to leave for the far World of Grammar.
      The Big Oxmox advised her not to do so, because there were thousands of bad Commas, wild Question Marks and devious Semikoli,
      but the Little Blind Text didn’t listen.
      She packed her seven versalia, put her initial into the belt and made herself on the way.
      When she reached the first hills of the Italic Mountains, she had a last view back on the skyline of her hometown Bookmarksgrove,
      the headline of Alphabet Village and the subline of her own road, the Line Lane.
      Pityful a rethoric question ran over her cheek, then she continued her way.
      On her way she met a copy.
      The copy warned the Little Blind Text, that where it came from it would have been rewritten a thousand times and everything
      that was left from its origin would be the word "and" and the Little Blind Text should turn around and return to its own, safe country.
      But nothing the copy said could convince her and so it didn’t take long until a few insidious Copy Writers ambushed her,
      made her drunk with Longe and Parole and dragged her into their agency,
      where they abused her for their projects again and again.
      And if she hasn’t been rewritten, then they are still using her.
    `),
  });
}

export function smtpDataContent2(): ISMTPDataContentOptions {
  return prepareSMTPDataContentOptions({
    from: [
      EmailAddress.from('valentin.richard@infomaniak.com'),
    ],
    to: [
      EmailAddress.from('valentin.richard@infomaniak.com'),
      // new EmailAddress('valentin.richard+to@infomaniak.com'),
    ],
    subject: ASCIIString.from(`note #${Math.floor(Math.random() * 1e6)}`),
    text: stringToUTF8EncodedStringBuffer(`Let me note this !`),
    html: stringToUTF8EncodedStringBuffer(`Let me note this <strong>please</strong>`),
  });
}

export async function smtpDataContent3(): Promise<ISMTPDataContentOptions> {

  const file = new File([`BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//Sabre//Sabre VObject 4.3.5//EN
CALSCALE:GREGORIAN
METHOD:REQUEST
BEGIN:VTIMEZONE
TZID:Europe/Paris
X-LIC-LOCATION:Europe/Paris
BEGIN:STANDARD
TZOFFSETFROM:+0200
TZOFFSETTO:+0100
TZNAME:CET
DTSTART:20211031T010000
END:STANDARD
BEGIN:DAYLIGHT
TZOFFSETFROM:+0100
TZOFFSETTO:+0200
TZNAME:CEST
DTSTART:20220327T010000
END:DAYLIGHT
END:VTIMEZONE
BEGIN:VEVENT
SUMMARY:B2B Debrief
DESCRIPTION:\\n\\n/*----------------------------------------*/\\nMerci de ne p
 as modifier cette partie.\\n\\nVous pouvez rejoindre la salle de conférence
  kMeet à l'adresse suivante: https://kmeet.infomaniak.com/lzbd-bbjh-rkqb-
 xvpq\\n/*----------------------------------------*/\\n
TRANSP:OPAQUE
SEQUENCE:1
UID:53e698d8-2c56-461a-81f1-2c4d26695c26
DTSTART;TZID=Europe/Paris:20220314T133000
DTEND;TZID=Europe/Paris:20220314T143000
ORGANIZER;CN=Nicolas Borreil;EMAIL=nicolas.borreil@infomaniak.com:mailto:ni
 colas.borreil@infomaniak.com
ATTENDEE;CUTYPE=INDIVIDUAL;PARTSTAT=ACCEPTED;ROLE=CHAIR;CN=Nicolas Borreil:
 mailto:nicolas.borreil@infomaniak.com
ATTENDEE;CUTYPE=INDIVIDUAL;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT;CN=Ju
 lien Viard;RSVP=TRUE:mailto:julien.viard@infomaniak.com
ATTENDEE;CUTYPE=INDIVIDUAL;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT;CN=Ni
 cola Ricca;RSVP=TRUE:mailto:nicola.ricca@infomaniak.com
ATTENDEE;CUTYPE=INDIVIDUAL;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT;CN=Va
 lentin Richard;RSVP=TRUE:mailto:valentin.richard@infomaniak.com
ATTENDEE;CUTYPE=INDIVIDUAL;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT;CN=Fl
 orent Glauda;RSVP=TRUE:mailto:florent.glauda@infomaniak.com
ATTENDEE;CUTYPE=INDIVIDUAL;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT;CN=Ma
 xime Joris;RSVP=TRUE:mailto:maxime.joris@infomaniak.com
ATTENDEE;CUTYPE=INDIVIDUAL;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT;CN=Ma
 rc Oehler (Marc de G'nève);RSVP=TRUE:mailto:marc.oehler@infomaniak.com
ATTENDEE;CUTYPE=INDIVIDUAL;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT;CN=An
 toine Bourgeois;RSVP=TRUE:mailto:antoine.bourgeois@infomaniak.com
ATTENDEE;CUTYPE=INDIVIDUAL;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT;CN=Ca
 mille Granaï;RSVP=TRUE:mailto:camille.granai@infomaniak.com
ATTENDEE;CUTYPE=INDIVIDUAL;PARTSTAT=NEEDS-ACTION;ROLE=REQ-PARTICIPANT;CN=Ma
 xime Tassy;RSVP=TRUE:mailto:maxime.tassy@infomaniak.com
X-INFOMANIAK-MEET-ROOM-URL:https://kmeet.infomaniak.com/lzbd-bbjh-rkqb-xvpq
DTSTAMP:20220310T105243Z
END:VEVENT
END:VCALENDAR`], 'invite.ics', { type: 'application/ics; charset="UTF-8"; name=invite.ics' });

  return prepareSMTPDataContentOptions({
    from: [
      EmailAddress.from('valentin.richard@infomaniak.com'),
    ],
    to: [
      EmailAddress.from('valentin.richard@infomaniak.com'),
      // new EmailAddress('valentin.richard+to@infomaniak.com'),
    ],
    subject: ASCIIString.from(`Invitation ${Math.floor(Math.random() * 1e6)}`),
    text: stringToUTF8EncodedStringBuffer(`Please check this invitation`),
    attachments: [
      await EmailAttachment.fromFile(file),
    ],
  });
}

export async function smtpDataContentExample1(): Promise<void> {
  // const config: ISMTPDataContentOptions = smtpDataContent1();
  // const config: ISMTPDataContentOptions = smtpDataContent2();
  const config: ISMTPDataContentOptions = await smtpDataContent3();

  const buffer: Uint8Array = new Uint8Array(1e6);
  const index: number = smtp$DataContent$BufferEncoder(
    config,
    buffer,
    0,
  );

  const _buffer: Uint8Array = buffer.subarray(0, index);

  console.log(ASCIIString.fromUnsafeBuffer(_buffer).toString());
}


export async function websocketExample1() {

  const config = SMTP_CONFIG;

  const stream$ = createRawSocketByteStream({
    hostname: config.hostname,
    port: config.port,
  });

  const client = await createSMTPClientFromByteStream({
    stream$,
    ...config,
  });

  console.log('client connected');

  window.onclick = async () => {
    await client.send(await smtpDataContent3());
    console.log('sent');
  };
}

/*----------------------------------*/

export function websocketExample() {
  // circularUint8ArrayExample1();
  // emailAddressExample1();
  // asciiStringExample1();
  // emailMessageExample1();
  mimeTypeExample1();
  // websocketExample1();
  // smtpDataContentExample1();
}
