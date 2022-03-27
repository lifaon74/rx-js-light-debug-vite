import {
  createErrorNotification, createNextNotification,
  fromEventTarget, fromPromiseFactory, fulfilled$$$, IErrorNotification, INextNotification, IObservable, map$$, merge,
  pipe$$,
} from '@lifaon/rx-js-light';


// https://web.dev/nfc/#check-for-permission
// https://w3c.github.io/web-nfc/#ndef-compatible-tag-types

type IScanNFCNotifications = INextNotification<any> | IErrorNotification;

function scanNFC(
  reader: any,
): IObservable<IScanNFCNotifications> {
  const scan$ = fromPromiseFactory((signal: AbortSignal): Promise<unknown> => {
    return reader.scan({ signal });
  });

  return pipe$$(scan$, [
    fulfilled$$$(() => {
      const readingError$ = map$$(fromEventTarget(reader, 'readingerror'), (): IErrorNotification => {
        return createErrorNotification(new Error(`reading`));
      });

      const reading$ = map$$(fromEventTarget(reader, 'reading'), (event: any): INextNotification<any> => {
        return createNextNotification(event);
      });

      return merge([
        readingError$,
        reading$,
      ]);
    }),
  ]);
}

function writeNFC(
  reader: any,
  data: any,
): IObservable<unknown> {
  return fromPromiseFactory((signal: AbortSignal): Promise<unknown> => {
    return reader.write(data, { signal });
  });
}

async function debugNFC1() {

  if (!('NDEFReader' in globalThis)) {
    console.log('NDEFReader not supported');
    return;
  }

  const reader: any = new (globalThis as any).NDEFReader() as any;

  async function startScanning() {
    await reader.scan();
    console.log('scanning');

    const readingError$ = fromEventTarget(reader, 'readingerror');
    const reading$ = fromEventTarget(reader, 'reading');

    readingError$((error: any) => {
      console.log(error);
    });

    reading$((value: any) => {
      console.log(value);
    });
  }

  const nfcPermissionStatus = await navigator.permissions.query({ name: 'nfc' as any });

  if (nfcPermissionStatus.state === "granted") {
    startScanning();
  } else {
    const unsubscribe = fromEventTarget(window, 'click')(() => {
      unsubscribe();
      startScanning();
    });
  }
}

export async function debugNFC() {
  await debugNFC1();
}
