export interface IBatteryState {
  charging: boolean;
  chargingTime: number; // in s
  dischargingTime: number; // in s
  level: number; // [0, 1]
}
