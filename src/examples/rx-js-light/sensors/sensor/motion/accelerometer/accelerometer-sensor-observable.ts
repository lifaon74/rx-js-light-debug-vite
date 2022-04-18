import { IObservable } from '@lirx/core';
import { createSensorObservable, ISensorObservableNotifications } from '../../sensor-observable';

export interface IAccelerometerSensorObservableValue {
  x: number;
  y: number;
  z: number;
}

export type IAccelerometerSensorObservableNotifications = ISensorObservableNotifications<IAccelerometerSensorObservableValue>;


/**
 * https://developer.mozilla.org/en-US/docs/Web/API/Accelerometer
 */
export function accelerometerSensorObservable(
  options?: MotionSensorOptions,
): IObservable<IAccelerometerSensorObservableNotifications> {
  return createSensorObservable<Accelerometer, IAccelerometerSensorObservableValue>(
    () => new Accelerometer(options),
    (sensor: Accelerometer): IAccelerometerSensorObservableValue => {
      return {
        x: sensor.x as number,
        y: sensor.y as number,
        z: sensor.z as number,
      };
    }
  );
}
