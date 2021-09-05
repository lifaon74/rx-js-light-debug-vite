import { IPosition } from './position.type';

export function createPosition(
  left: number,
  top: number,
): IPosition {
  return {
    left,
    top,
  };
}
