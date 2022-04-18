import {
  createErrorNotification, createNetworkErrorFromResponse, createNextNotification, createReplaySource, fromEventTarget,
  fromFetch, fromPromise,
  fulfilled$$$,
  IDefaultNotificationsUnion,
  IObservable, IObserver, IUnsubscribe, mergeUnsubscribeFunctions, noop, pipe$$, shareR$$, shareR$$$, singleN,
  STATIC_COMPLETE_NOTIFICATION,
  then$$$,
  throwError,
} from '@lirx/core';
import { createElement } from '@lirx/dom';

export function createImage(
  src: string,
): HTMLImageElement {
  const image: HTMLImageElement = createElement('img');
  image.src = src;
  return image;
}

export function loadImage$$(
  image: HTMLImageElement,
): IObservable<IDefaultNotificationsUnion<HTMLImageElement>> {
  return (emit: IObserver<IDefaultNotificationsUnion<HTMLImageElement>>): IUnsubscribe => {
    const done = () => {
      emit(createNextNotification(image));
      emit(STATIC_COMPLETE_NOTIFICATION);
    };

    if (image.complete) {
      done();
      return noop;
    } else {
      const end = mergeUnsubscribeFunctions([
        fromEventTarget(image, 'load')(() => {
          end();
          done();
        }),
        fromEventTarget(image, 'error')(() => {
          end();
          emit(createErrorNotification(new Error(`Failed to load`)));
        }),
      ]);
      return end;
    }
  };
}

export function image$$(
  src: string,
): IObservable<IDefaultNotificationsUnion<HTMLImageElement>> {
  return loadImage$$(createImage(src));
}


// export function src$$(
//   src: string,
// ): IObservable<IDefaultNotificationsUnion<string>> {
//   return pipe$$(image$$(src), [
//     fulfilled$$$((image: HTMLImageElement): IObservable<IDefaultNotificationsUnion<string>> => {
//       const ctx = createCanvasRenderingContext2D(image.naturalWidth, image.naturalHeight);
//       ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
//       return singleN(ctx.canvas.toDataURL());
//     }),
//   ]);
// }


/*----------------*/

export function awaitImageLoaded(
  image: HTMLImageElement,
): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((
    resolve: (value: HTMLImageElement) => void,
    reject: (reason?: any) => void,
  ): void => {
    if (image.complete) {
      resolve(image);
    } else {
      const end = mergeUnsubscribeFunctions([
        fromEventTarget(image, 'load')(() => {
          end();
          resolve(image);
        }),
        fromEventTarget(image, 'error')(() => {
          end();
          reject(image);
        }),
      ]);
    }
  });
}

export function createAndAwaitImage(
  src: string,
): Promise<HTMLImageElement> {
  return awaitImageLoaded(createImage(src));
}


export function createCanvas(
  width: number,
  height: number,
): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function createCanvasRenderingContext2D(
  width: number,
  height: number,
): CanvasRenderingContext2D {
  return createCanvas(width, height).getContext('2d') as CanvasRenderingContext2D;
}

export function sourceToDataURL(
  src: string,
): Promise<string> {
  return createAndAwaitImage(src)
    .then((image: HTMLImageElement): string => {
      const ctx = createCanvasRenderingContext2D(image.naturalWidth, image.naturalHeight);
      ctx.drawImage(image, 0, 0, image.naturalWidth, image.naturalHeight);
      return ctx.canvas.toDataURL();
    });
}
