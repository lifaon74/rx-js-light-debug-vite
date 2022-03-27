import { IDeviceMotionAcceleration } from './device-motion-acceleration.type';

export interface IDeviceMotion {
  acceleration: IDeviceMotionAcceleration | null;
  accelerationIncludingGravity: IDeviceMotionAcceleration | null;
  interval: number;
  rotationRate: DeviceMotionEventRotationRate | null;
}
