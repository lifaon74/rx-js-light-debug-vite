import { INetworkState } from './types/network-state.type';
import { getNavigatorConnection } from './get-navigator-connection';

export function getNetworkState(): INetworkState {
  const {
    type,
    effectiveType,
    downlinkMax,
    downlink,
    rtt,
    saveData,
  } = getNavigatorConnection() as any;

  return {
    type,
    effectiveType,
    downlinkMax: downlinkMax * 1e6,
    downlink: downlink * 1e6,
    rtt,
    saveData,
  };
}
