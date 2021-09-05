// import { fromAnimationFrame, ISubscribeFunction } from '@lifaon/rx-js-light';
// import { ICSSPositionAndSize } from '../../../../../../../misc/types/position-and-size/css-position-and-size.type';
// import { map$$ } from '@lifaon/rx-js-light-shortcuts';
// import { querySelector } from '@lifaon/rx-dom';
// import { IPositionAndSize } from '../../../../../../../misc/types/position-and-size/position-and-size.type';
// import { getElementPositionAndSize } from '../../../../../../../misc/types/position-and-size/get-element-position-and-size';
// import { ISize } from '../../../../../../../misc/types/size/size.type';
// import {
//   fitBoxRelativeToTargetBoxWith$BottomLeft$TopLeftPreference, getElementExpectedSize
// } from './fit-box-relative-to-target-box';
// import { positionAndSizeToCSSPositionAndSize } from '../../../../../../../misc/types/position-and-size/position-and-size-to-css-position-and-size';
// import {
//   getExternalBoxForContainerElementWithMargin, IGetExternalBoxForContainerElementWithMarginOptions
// } from './get-external-box-for-container-element-with-margin';
// import {
//   getTargetBoxForTargetElementWithMargin, IGetTargetBoxForTargetElementWithMarginOptions
// } from './get-target-box-for-target-element-with-margin';
//
//
// export interface IGetPositionAndSizeSubscribeFunctionForSimpleOverlayContainerFunction {
//   (): HTMLElement;
// }
//
// export interface IGetPositionAndSizeSubscribeFunctionForSimpleOverlayOptions {
//   getContainerElement: IGetPositionAndSizeSubscribeFunctionForSimpleOverlayContainerFunction;
//   targetElement: HTMLElement;
//   trigger$?: ISubscribeFunction<any>;
//   elementMargin?: number;
//   containerHorizontalMargin?: number;
//   containerVerticalMargin?: number;
// }
//
// export function getPositionAndSizeSubscribeFunctionForSimpleOverlay(
//   {
//     getContainerElement,
//     targetElement,
//     trigger$ = fromAnimationFrame(),
//     elementMargin = 5,
//     containerHorizontalMargin = 5,
//     containerVerticalMargin = 5,
//   }: IGetPositionAndSizeSubscribeFunctionForSimpleOverlayOptions,
// ): ISubscribeFunction<ICSSPositionAndSize> {
//   return map$$<void, ICSSPositionAndSize>(trigger$, () => {
//     const containerElement: HTMLElement = getContainerElement();
//     const contentElement: HTMLElement | null = querySelector(containerElement, `:scope > .content`);
//
//     if (contentElement === null) {
//       return {
//         left: '-10000px',
//         top: '-10000px',
//         width: '0',
//         height: '0',
//       };
//     } else {
//       const containerElementPositionAndSize: IPositionAndSize = getElementPositionAndSize(containerElement);
//       const targetElementPositionAndSize: IPositionAndSize = getElementPositionAndSize(targetElement);
//
//       contentElement.style.setProperty('margin-right', `${ containerHorizontalMargin }px`);
//       contentElement.style.setProperty('margin-bottom', `${ containerVerticalMargin }px`);
//
//       const contentElementSize: ISize = getElementExpectedSize(
//         contentElement,
//         { width: targetElementPositionAndSize.width },
//       );
//
//       const _containerHorizontalMargin: number = Math.min(containerHorizontalMargin, containerElementPositionAndSize.width / 2);
//       const _containerVerticalMargin: number = Math.min(containerVerticalMargin, containerElementPositionAndSize.height / 2);
//
//       const externalBox: IPositionAndSize = {
//         left: _containerHorizontalMargin,
//         top: _containerVerticalMargin,
//         width: containerElementPositionAndSize.width - (_containerHorizontalMargin * 2),
//         height: containerElementPositionAndSize.height - (_containerVerticalMargin * 2),
//       };
//
//       const targetBox: IPositionAndSize = {
//         left: targetElementPositionAndSize.left,
//         top: targetElementPositionAndSize.top - elementMargin,
//         width: targetElementPositionAndSize.width,
//         height: targetElementPositionAndSize.height + (elementMargin * 2),
//       };
//
//       return positionAndSizeToCSSPositionAndSize(
//         fitBoxRelativeToTargetBoxWith$BottomLeft$TopLeftPreference(externalBox, targetBox, contentElementSize),
//       );
//     }
//   });
// }
//
//
