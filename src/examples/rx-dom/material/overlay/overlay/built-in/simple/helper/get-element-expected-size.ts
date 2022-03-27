import { IPartialSize, ISize } from '../../../../../../../misc/types/size/size.type';

/**
 * @deprecated
 */
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
  }

  if (expectedHeight === void 0) {
    element.style.setProperty('height', 'auto');
  }

  if (
    (expectedWidth === void 0)
    || (expectedHeight === void 0)
  ) {
    const rect: DOMRect = element.getBoundingClientRect();
    width = (expectedWidth === void 0)
      ? rect.width
      : expectedWidth;
    height = (expectedHeight === void 0)
      ? rect.height
      : expectedHeight;
  } else {
    width = expectedWidth;
    height = expectedHeight;
  }

  return {
    width,
    height,
  };
}

// export function getElementExpectedSize(
//   element: HTMLElement,
//   {
//     width: expectedWidth,
//     height: expectedHeight,
//   }: IPartialSize = {}, // expectedBox
// ): ISize {
//   let width: number, height: number;
//
//   if (expectedWidth === void 0) {
//     element.style.setProperty('width', 'auto');
//     width = element.getBoundingClientRect().width;
//   } else {
//     width = expectedWidth;
//   }
//
//   if (expectedHeight === void 0) {
//     element.style.setProperty('height', 'auto');
//     height = element.getBoundingClientRect().height;
//   } else {
//     height = expectedHeight;
//   }
//
//   return {
//     width,
//     height,
//   };
// }
