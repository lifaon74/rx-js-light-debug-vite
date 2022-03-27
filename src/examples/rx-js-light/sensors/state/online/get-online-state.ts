import { getNavigator } from '../../shared/get-navigator';

export function getOnlineState(): boolean {
  return getNavigator().onLine;
}
