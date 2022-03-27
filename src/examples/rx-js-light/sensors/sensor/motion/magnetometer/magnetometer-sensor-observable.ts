import { IObservable } from '@lifaon/rx-js-light';
import { createSensorObservable, ISensorObservableNotifications } from '../../sensor-observable';

export interface IMagnetometerSensorObservableValue {
  x: number;
  y: number;
  z: number;
}

export type IMagnetometerSensorObservableNotifications = ISensorObservableNotifications<IMagnetometerSensorObservableValue>;


/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Magnetometer
 */
export function magnetometerSensorObservable(
  options?: MotionSensorOptions,
): IObservable<IMagnetometerSensorObservableNotifications> {
  return createSensorObservable<Magnetometer, IMagnetometerSensorObservableValue>(
    () => new Magnetometer(options),
    (sensor: Magnetometer): IMagnetometerSensorObservableValue => {
      return {
        x: sensor.x as number,
        y: sensor.y as number,
        z: sensor.z as number,
      };
    }
  );
}
