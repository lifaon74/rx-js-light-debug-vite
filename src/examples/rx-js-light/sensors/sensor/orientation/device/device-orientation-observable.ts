import { fromEventTarget, IObservable, mapObservable, toTypedEventTarget } from '@lirx/core';
import { IDeviceOrientation } from './device-orientation.type';

export function deviceOrientationObservable(): IObservable<IDeviceOrientation> {
  return mapObservable(
    fromEventTarget<'deviceorientation', DeviceOrientationEvent>(toTypedEventTarget(window), 'deviceorientation'),
    (
      {
       absolute,
       alpha,
       beta,
       gamma,
     }: DeviceOrientationEvent,
    ): IDeviceOrientation => {
      return {
        absolute,
        alpha,
        beta,
        gamma,
      };
    },
  );
}
