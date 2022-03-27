import { BatteryManager } from './types/battery-manager.type';
import { IBatteryState } from './types/battery-state.type';

export function getBatteryState(
  {
    charging,
    chargingTime,
    dischargingTime,
    level,
  }: BatteryManager,
): IBatteryState {
  return {
    charging,
    chargingTime,
    dischargingTime,
    level,
  };
}
