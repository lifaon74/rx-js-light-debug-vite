import {
  createNextNotification, fromPromise, fulfilledObservable, IErrorNotification, INextNotification, IObservable,
  mapObservable,
} from '@lifaon/rx-js-light';
import { IBatteryState } from './types/battery-state.type';
import { BatteryManager } from './types/battery-manager.type';
import { getBattery } from './get-battery';
import { batteryObservable } from './battery-observable';


export type IBatteryObservableNotifications =
  INextNotification<IBatteryState>
  | IErrorNotification;

export function batteryObservableWithNotifications(): IObservable<IBatteryObservableNotifications> {
  return fulfilledObservable(
    fromPromise(getBattery()),
    (battery: BatteryManager): IObservable<IBatteryObservableNotifications> => {
      return mapObservable(
        batteryObservable(battery),
        (batteryState: IBatteryState): INextNotification<IBatteryState> => createNextNotification<IBatteryState>(batteryState),
      );
    },
  );
}
