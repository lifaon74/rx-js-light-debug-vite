import { ICSSPosition } from './css-position.type';
import { IPosition } from './position.type';

export function positionToCSSPosition(
  {
    left,
    top,
  }: IPosition,
): ICSSPosition {
  return {
    left: `${ left }px`,
    top: `${ top }px`,
  };
}
