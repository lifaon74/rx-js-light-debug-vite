import { fromAnimationFrame, IObservable, map$$ } from '@lirx/core';
import { ICSSPositionAndSize } from '../../../../../../../misc/types/position-and-size/css-position-and-size.type';
import { querySelector } from '@lirx/dom';
import { POSITION_AND_SIZE_OUT_OF_WINDOW } from './position-and-size-out-of-window.constant';
import { IPositionAndSize } from '../../../../../../../misc/types/position-and-size/position-and-size.type';
import {
  getElementPositionAndSize,
} from '../../../../../../../misc/types/position-and-size/get-element-position-and-size';
import { ISize } from '../../../../../../../misc/types/size/size.type';
import {
  positionAndSizeToCSSPositionAndSize,
} from '../../../../../../../misc/types/position-and-size/position-and-size-to-css-position-and-size';
import {
  getFittingBoxForContainer$Target$ContentElements,
} from './get-fitting-box-for-container-target-content-elements';
import {
  IGetExternalBoxForContainerElementWithMarginOptions,
} from './get-external-box-for-container-element-with-margin';
import { IGetTargetBoxForTargetElementWithMarginOptions } from './get-target-box-for-target-element-with-margin';
import { MatOverlayComponent } from '../../../__component/mat-overlay.component';
import { IGetContentElementSizeFunction } from './get-position-and-size-observable-for-overlay-near-target-element';

/**
 * @deprecated
 */
export interface IGetPositionAndSizeObservableForSimpleOverlayOptions extends //
  Pick<IGetExternalBoxForContainerElementWithMarginOptions, 'containerHorizontalMargin' | 'containerVerticalMargin'>,
  Pick<IGetTargetBoxForTargetElementWithMarginOptions, 'elementMargin'>
//
{
  getContainerElement: IGetContainerElementFunction;
  targetElement: HTMLElement;
  getContentElementSize: IGetContentElementSizeFunction;
}

/**
 * @deprecated
 */
export interface IGetContainerElementFunction {
  (): MatOverlayComponent
}


/**
 * @deprecated
 */
export function getPositionAndSizeObservableForSimpleOverlay(
  {
    getContainerElement,
    targetElement,
    getContentElementSize,
    ...options
  }: IGetPositionAndSizeObservableForSimpleOverlayOptions,
): IObservable<ICSSPositionAndSize> {
  return map$$<void, ICSSPositionAndSize>(fromAnimationFrame(), () => {
    const containerElement: HTMLElement = getContainerElement();
    const contentElement: HTMLElement | null = querySelector(containerElement, `:scope > .content`);

    if (contentElement === null) {
      return POSITION_AND_SIZE_OUT_OF_WINDOW;
    } else {
      const containerElementPositionAndSize: IPositionAndSize = getElementPositionAndSize(containerElement);
      const targetElementPositionAndSize: IPositionAndSize = getElementPositionAndSize(targetElement);

      const contentElementSize: ISize = getContentElementSize({
        contentElement,
        containerElementPositionAndSize,
        targetElementPositionAndSize,
      });

      return positionAndSizeToCSSPositionAndSize(
        getFittingBoxForContainer$Target$ContentElements({
          containerElementPositionAndSize,
          targetElementPositionAndSize,
          contentElementSize,
          // extra
          ...options,
        }),
      );
    }
  });
}


/*--------------------------*/







