import {
  createNetworkErrorFromResponse,
  fromFetch, fromPromise, fulfilled$$$, IDefaultNotificationsUnion, IObservable, pipe$$, singleN, throwError,
} from '@lirx/core';
import { cacheFulfilledObservablePipe } from '../../misc/cache-fulfilled-observable';

export function src$$(
  src: string,
): IObservable<IDefaultNotificationsUnion<string>> {
  if (src.startsWith('data:')) {
    return singleN(src);
  } else {
    return pipe$$(fromFetch(src), [
      fulfilled$$$<Response, IDefaultNotificationsUnion<string>>((response: Response): IObservable<IDefaultNotificationsUnion<string>> => {
        if (response.ok) {
          const contentType: string = response.headers.get('content-type') as string;
          return pipe$$(fromPromise(response.arrayBuffer()), [
            fulfilled$$$((buffer: ArrayBuffer): IObservable<IDefaultNotificationsUnion<string>> => {
              const data: Uint8Array = new Uint8Array(buffer);
              let byteString: string = '';
              for (let i = 0, l = data.length; i < l; i++) {
                const byte: number = data[i];
                byteString += String.fromCharCode(byte);
              }
              const dataString: string = btoa(byteString);
              return singleN(`data:${contentType};base64,${dataString}`);
            }),
          ]);
        } else {
          return throwError(createNetworkErrorFromResponse(response));
        }
      }),
      cacheFulfilledObservablePipe<string>(),
    ]);
  }
}
