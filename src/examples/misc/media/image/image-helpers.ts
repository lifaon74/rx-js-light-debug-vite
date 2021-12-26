import { createElementNode } from '@lifaon/rx-dom';
import { fromEventTarget, IObservable, mergeUnsubscribeFunctions } from '@lifaon/rx-js-light';

export function createImage(
  src: string,
): HTMLImageElement {
  const image: HTMLImageElement = createElementNode('img');
  image.src = src;
  return image;
}

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
  height: number
): HTMLCanvasElement {
  const canvas: HTMLCanvasElement = createElementNode('canvas');
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

export function createCanvasRenderingContext2D(
  width: number,
  height: number
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
