import { getScreen } from '../../../shared/get-screen';

export function getScreenOrientation(): ScreenOrientation {
  return getScreen().orientation;
}
