import { IAccelerometerSensorObservableValue } from '../accelerometer-sensor-observable';
import { createSensorObservable, ISensorObservableNotifications } from '../../../sensor-observable';
import { IObservable } from '@lifaon/rx-js-light';

export interface IGravitySensorObservableValue extends IAccelerometerSensorObservableValue {
}

export type IGravitySensorObservableNotifications = ISensorObservableNotifications<IGravitySensorObservableValue>;


/**
 * https://developer.mozilla.org/en-US/docs/Web/API/GravitySensor
 */
export function gravitySensorObservable(
  options?: MotionSensorOptions,
): IObservable<IGravitySensorObservableNotifications> {
  return createSensorObservable<GravitySensor, IGravitySensorObservableValue>(
    () => new GravitySensor(options),
    (sensor: GravitySensor): IGravitySensorObservableValue => {
      return {
        x: sensor.x as number,
        y: sensor.y as number,
        z: sensor.z as number,
      };
    },
  );
}
