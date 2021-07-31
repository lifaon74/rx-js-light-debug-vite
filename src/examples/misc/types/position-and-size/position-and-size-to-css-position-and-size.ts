import { ICSSPositionAndSize } from './css-position-and-size.type';
import { IPositionAndSize } from './position-and-size.type';

export function positionAndSizeToCSSPositionAndSize(
  {
    left,
    top,
    width,
    height,
  }: IPositionAndSize,
): ICSSPositionAndSize {
  return {
    left: `${ left }px`,
    top: `${ top }px`,
    width: `${ width }px`,
    height: `${ height }px`,
  };
}
