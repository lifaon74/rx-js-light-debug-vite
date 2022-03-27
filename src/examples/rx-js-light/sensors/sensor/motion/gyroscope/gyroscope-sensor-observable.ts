import { IObservable } from '@lifaon/rx-js-light';
import { createSensorObservable, ISensorObservableNotifications } from '../../sensor-observable';

export interface IGyroscopeSensorObservableValue {
  x: number;
  y: number;
  z: number;
}

export type IGyroscopeSensorObservableNotifications = ISensorObservableNotifications<IGyroscopeSensorObservableValue>;


/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Gyroscope
 */
export function gyroscopeSensorObservable(
  options?: MotionSensorOptions,
): IObservable<IGyroscopeSensorObservableNotifications> {
  return createSensorObservable<Gyroscope, IGyroscopeSensorObservableValue>(
    () => new Gyroscope(options),
    (sensor: Gyroscope): IGyroscopeSensorObservableValue => {
      return {
        x: sensor.x as number,
        y: sensor.y as number,
        z: sensor.z as number,
      };
    }
  );
}
