import { IArrayBufferView } from '../array-buffer-view.type';
import {
  asyncUnsubscribe, createErrorNotification, createNextNotification, IErrorNotification, INextNotification, IObservable,
  IObserver, IUnsubscribe,
} from '@lifaon/rx-js-light';
import { CircularBuffer, createCircularUint8Array, ICircularUint8Array } from './circular-buffer';
import { createNotEnoughSpaceError } from '../../errors/not-enough-space/not-enough-space-error';

export interface ICreateCircularBufferFunction<GBuffer extends IArrayBufferView> {
  (): CircularBuffer<GBuffer>;
}

export type ICircularBufferObservableNotifications<GBuffer extends IArrayBufferView> =
  | INextNotification<CircularBuffer<GBuffer>>
  | IErrorNotification;

export function circularBufferObservable<GBuffer extends IArrayBufferView>(
  subscribe: IObservable<GBuffer>,
  createCircularBuffer: ICreateCircularBufferFunction<GBuffer>,
): IObservable<ICircularBufferObservableNotifications<GBuffer>> {
  return (emit: IObserver<ICircularBufferObservableNotifications<GBuffer>>): IUnsubscribe => {
    const buffer: CircularBuffer<GBuffer> = createCircularBuffer();
    let running: boolean = true;

    const clear = () => {
      if (running) {
        running = false;
        asyncUnsubscribe(() => unsubscribe);
      }
    };

    const unsubscribe = subscribe((value: GBuffer): void => {
      if (buffer.writable() < value.length) {
        emit(createErrorNotification(createNotEnoughSpaceError()));
        clear();
      } else {
        buffer.write(value);
        emit(createNextNotification<CircularBuffer<GBuffer>>(buffer));
      }
    });

    return clear;
  };
}

/*------------*/

export type ICircularUint8ArrayObservableNotifications = ICircularBufferObservableNotifications<Uint8Array>

export function circularUint8ArrayObservable(
  subscribe: IObservable<Uint8Array>,
  size?: number,
): IObservable<ICircularUint8ArrayObservableNotifications> {
  return circularBufferObservable<Uint8Array>(subscribe, (): ICircularUint8Array => {
    return createCircularUint8Array(size);
  });
}
