import { BatteryManager } from './types/battery-manager.type';
import { getNavigator } from '../../shared/get-navigator';

export function getBattery(): Promise<BatteryManager> {
  return (getNavigator() as any).getBattery();
}
