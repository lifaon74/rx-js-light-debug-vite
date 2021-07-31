import { IPosition } from './position.type';

export function translatePosition(
  position: IPosition,
  translation: IPosition,
): IPosition {
  return {
    left: position.left + translation.left,
    top: position.top + translation.top,
  };
}
