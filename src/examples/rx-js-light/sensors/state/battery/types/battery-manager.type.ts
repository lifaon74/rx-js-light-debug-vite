import { IReadonlyEventTarget, IToEventMap } from '@lifaon/rx-js-light';
import { BatteryManagerEventsMap } from './battery-manager-events-map.type';

export interface BatteryManager extends IReadonlyEventTarget<IToEventMap<BatteryManagerEventsMap>> {
  readonly charging: boolean;
  readonly chargingTime: number;
  readonly dischargingTime: number;
  readonly level: number;
}
