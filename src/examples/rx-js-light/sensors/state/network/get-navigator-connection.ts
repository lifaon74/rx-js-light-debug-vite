import { getNavigator } from '../../shared/get-navigator';

export function getNavigatorConnection(): NetworkInformation {
  return getNavigator().connection;
}
