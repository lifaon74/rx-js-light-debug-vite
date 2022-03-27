import { IScreenOrientation } from './types/screen-orientation.type';
import { getScreenOrientation } from './get-screen-orientation';

export function getMappedScreenOrientation(): IScreenOrientation {
  const {
    angle,
    type,
  } = getScreenOrientation();
  return {
    angle,
    type,
  };
}
