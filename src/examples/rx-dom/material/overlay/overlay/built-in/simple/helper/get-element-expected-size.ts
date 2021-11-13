import { IPartialSize, ISize } from '../../../../../../../misc/types/size/size.type';

export function getElementExpectedSize(
  element: HTMLElement,
  {
    width: expectedWidth,
    height: expectedHeight,
  }: IPartialSize = {}, // expectedBox
): ISize {
  let width: number, height: number;

  if (expectedWidth === void 0) {
    element.style.setProperty('width', 'auto');
    width = element.getBoundingClientRect().width;
  } else {
    width = expectedWidth;
  }

  if (expectedHeight === void 0) {
    element.style.setProperty('height', 'auto');
    height = element.getBoundingClientRect().height;
  } else {
    height = expectedHeight;
  }

  return {
    width,
    height,
  };
}
