import { fromEventTarget, IObservable, mapObservable, toTypedEventTarget } from '@lirx/core';
import { IDeviceMotionRotationRate } from './types/device-motion-rotation-rate.type';
import { IDeviceMotionAcceleration } from './types/device-motion-acceleration.type';
import { IDeviceMotion } from './types/device-motion.type';

export function deviceMotionObservable(): IObservable<IDeviceMotion> {
  return mapObservable(
    fromEventTarget<'devicemotion', DeviceMotionEvent>(toTypedEventTarget(window), 'devicemotion'),
    (
      event: DeviceMotionEvent,
    ): IDeviceMotion => {
      const acceleration: IDeviceMotionAcceleration | null = (event.acceleration === null)
        ? null
        : {
          x: event.acceleration.x,
          y: event.acceleration.y,
          z: event.acceleration.z,
        };

      const accelerationIncludingGravity: IDeviceMotionAcceleration | null = (event.accelerationIncludingGravity === null)
        ? null
        : {
          x: event.accelerationIncludingGravity.x,
          y: event.accelerationIncludingGravity.y,
          z: event.accelerationIncludingGravity.z,
        };

      const rotationRate: IDeviceMotionRotationRate | null = (event.rotationRate === null)
        ? null
        : {
          alpha: event.rotationRate.alpha,
          beta: event.rotationRate.beta,
          gamma: event.rotationRate.gamma,
        };

      return {
        acceleration,
        accelerationIncludingGravity,
        interval: event.interval,
        rotationRate,
      };
    },
  );
}
