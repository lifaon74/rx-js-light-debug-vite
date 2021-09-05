import { IPositionAndSize } from '../../../../../../../misc/types/position-and-size/position-and-size.type';

export interface IGetExternalBoxForContainerElementWithMarginOptions {
  containerElementPositionAndSize: IPositionAndSize;
  containerHorizontalMargin?: number;
  containerVerticalMargin?: number;
}

export function getExternalBoxForContainerElementWithMargin(
  {
    containerElementPositionAndSize,
    containerHorizontalMargin = 5,
    containerVerticalMargin = 5,
  }: IGetExternalBoxForContainerElementWithMarginOptions,
): IPositionAndSize {
  const _containerHorizontalMargin: number = Math.min(containerHorizontalMargin, containerElementPositionAndSize.width / 2);
  const _containerVerticalMargin: number = Math.min(containerVerticalMargin, containerElementPositionAndSize.height / 2);
  return {
    left: _containerHorizontalMargin,
    top: _containerVerticalMargin,
    width: containerElementPositionAndSize.width - (_containerHorizontalMargin * 2),
    height: containerElementPositionAndSize.height - (_containerVerticalMargin * 2),
  };
}

