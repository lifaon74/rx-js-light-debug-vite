import { INetworkConnectionType } from './network-connection-type.type';
import { INetworkEffectiveConnectionType } from './network-effective-connection-type.type';

export interface INetworkState {
  type: INetworkConnectionType;
  effectiveType: INetworkEffectiveConnectionType;
  downlinkMax: number; // in bits
  downlink: number; // in bits
  rtt: number; // in ms
  saveData: boolean;
}
