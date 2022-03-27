import {
  createEventListener, IObservable, IObserver, IRemoveEventListener, IUnsubscribe, mergeUnsubscribeFunctions,
} from '@lifaon/rx-js-light';
import { IBatteryState } from './types/battery-state.type';
import { BatteryManager } from './types/battery-manager.type';
import { getBatteryState } from './get-battery-state';
import { BatteryManagerEventsMap } from './types/battery-manager-events-map.type';


export function batteryObservable(
  battery: BatteryManager,
): IObservable<IBatteryState> {
  return (emit: IObserver<IBatteryState>): IUnsubscribe => {

    emit(getBatteryState(battery));

    type GKey = keyof BatteryManagerEventsMap;

    return mergeUnsubscribeFunctions(
      ([
        'chargingchange',
        'chargingtimechange',
        'dischargingtimechange',
        'levelchange',
      ] as GKey[]).map((name: GKey): IRemoveEventListener => {
        return createEventListener<GKey, Event>(battery, name, (): void => {
          emit(getBatteryState(battery));
        });
      }),
    );
  };
}
