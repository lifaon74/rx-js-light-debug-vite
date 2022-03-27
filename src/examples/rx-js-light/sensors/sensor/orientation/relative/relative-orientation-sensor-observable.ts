import { IObservable } from '@lifaon/rx-js-light';
import { createSensorObservable, ISensorObservableNotifications } from '../../sensor-observable';

export interface IRelativeOrientationSensorObservableValue {
  quaternion: number[];
}

export type IRelativeOrientationSensorObservableNotifications = ISensorObservableNotifications<IRelativeOrientationSensorObservableValue>;


/**
 * https://developer.mozilla.org/en-US/docs/Web/API/RelativeOrientationSensor
 */
export function relativeOrientationSensorObservable(
  options?: MotionSensorOptions,
): IObservable<IRelativeOrientationSensorObservableNotifications> {
  return createSensorObservable<RelativeOrientationSensor, IRelativeOrientationSensorObservableValue>(
    () => new RelativeOrientationSensor(options),
    (sensor: RelativeOrientationSensor): IRelativeOrientationSensorObservableValue => {
      return {
        quaternion: sensor.quaternion as number[],
      };
    }
  );
}
