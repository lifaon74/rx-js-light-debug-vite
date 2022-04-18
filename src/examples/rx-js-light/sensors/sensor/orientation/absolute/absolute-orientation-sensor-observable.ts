import { IObservable } from '@lirx/core';
import { createSensorObservable, ISensorObservableNotifications } from '../../sensor-observable';

export interface IAbsoluteOrientationSensorObservableValue {
  quaternion: number[];
}

export type IAbsoluteOrientationSensorObservableNotifications = ISensorObservableNotifications<IAbsoluteOrientationSensorObservableValue>;


/**
 * https://developer.mozilla.org/en-US/docs/Web/API/AbsoluteOrientationSensor
 */
export function absoluteOrientationSensorObservable(
  options?: MotionSensorOptions,
): IObservable<IAbsoluteOrientationSensorObservableNotifications> {
  return createSensorObservable<AbsoluteOrientationSensor, IAbsoluteOrientationSensorObservableValue>(
    () => new AbsoluteOrientationSensor(options),
    (sensor: AbsoluteOrientationSensor): IAbsoluteOrientationSensorObservableValue => {
      return {
        quaternion: sensor.quaternion as number[],
      };
    }
  );
}
