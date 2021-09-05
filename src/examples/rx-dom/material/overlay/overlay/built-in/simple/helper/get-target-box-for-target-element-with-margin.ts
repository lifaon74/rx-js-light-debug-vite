import { IPositionAndSize } from '../../../../../../../misc/types/position-and-size/position-and-size.type';

export interface IGetTargetBoxForTargetElementWithMarginOptions {
  targetElementPositionAndSize: IPositionAndSize;
  elementMargin?: number;
}

export function getTargetBoxForTargetElementWithMargin(
  {
    targetElementPositionAndSize,
    elementMargin = 5,
  }: IGetTargetBoxForTargetElementWithMarginOptions,
): IPositionAndSize {
  return {
    left: targetElementPositionAndSize.left,
    top: targetElementPositionAndSize.top - elementMargin,
    width: targetElementPositionAndSize.width,
    height: targetElementPositionAndSize.height + (elementMargin * 2),
  };
}
