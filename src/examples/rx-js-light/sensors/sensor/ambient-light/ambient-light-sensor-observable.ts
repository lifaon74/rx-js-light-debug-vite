import { IObservable } from '@lirx/core';
import { createSensorObservable, ISensorObservableNotifications } from '../sensor-observable';

declare class AmbientLightSensor extends Sensor {
  constructor(options?: SensorOptions);
  readonly illuminance: number;
}


export interface IAmbientLightSensorObservableValue {
  illuminance: number;
}

export type IAmbientLightSensorObservableNotifications = ISensorObservableNotifications<IAmbientLightSensorObservableValue>;


/**
 * https://w3c.github.io/ambient-light/#dom-ambientlightsensor-ambientlightsensor
 */
export function ambientLightSensorObservable(
  options?: SensorOptions,
): IObservable<IAmbientLightSensorObservableNotifications> {
  return createSensorObservable<AmbientLightSensor, IAmbientLightSensorObservableValue>(
    () => new AmbientLightSensor(options),
    (sensor: AmbientLightSensor): IAmbientLightSensorObservableValue => {
      return {
        illuminance: sensor.illuminance,
      };
    }
  );
}
