import { defer, fromResizeObserver, idle, interval, IObservable, map$$, merge } from '@lifaon/rx-js-light';
import { ICSSPositionAndSize } from '../../../../../../../misc/types/position-and-size/css-position-and-size.type';
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
import { getParentElementOrThrow } from '@lifaon/rx-dom';


export interface IGetContentElementSizeFunction {
  (options: IContentElementSizeOptions): ISize;
}

export interface IContentElementSizeOptions {
  contentElement: HTMLElement;
  containerElementPositionAndSize: IPositionAndSize;
  targetElementPositionAndSize: IPositionAndSize;
}

export interface IGetPositionAndSizeObservableForOverlayNearTargetElementOptions extends //
  Pick<IGetExternalBoxForContainerElementWithMarginOptions, 'containerHorizontalMargin' | 'containerVerticalMargin'>,
  Pick<IGetTargetBoxForTargetElementWithMarginOptions, 'elementMargin'>
//
{
  contentElement: HTMLElement;
  getContentElementSize: IGetContentElementSizeFunction;
  targetElement: HTMLElement; // the element where to display the content
}

export function getPositionAndSizeObservableForOverlayNearTargetElement(
  {
    contentElement,
    getContentElementSize,
    targetElement,
    ...options
  }: IGetPositionAndSizeObservableForOverlayNearTargetElementOptions,
): IObservable<ICSSPositionAndSize> {
  return map$$<void, ICSSPositionAndSize>(createTriggerObservable(contentElement), (): ICSSPositionAndSize => {
    const containerElement: HTMLElement = getParentElementOrThrow(contentElement);
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

  });
}


function createTriggerObservable(
  contentElement: HTMLElement,
): IObservable<any> {
  // return timeout(500);
  // return fromAnimationFrame();
  return merge([
    defer(() => {
      return fromResizeObserver(getParentElementOrThrow(contentElement));
    }),
    interval(2000),
  ]);
}
