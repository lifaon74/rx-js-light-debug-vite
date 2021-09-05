import { IPosition } from './position.type';
import { createPosition } from './create-position';

export function translatePosition(
  position: IPosition,
  translation: IPosition,
): IPosition {
  return createPosition(
    position.left + translation.left,
    position.top + translation.top,
  );
}
