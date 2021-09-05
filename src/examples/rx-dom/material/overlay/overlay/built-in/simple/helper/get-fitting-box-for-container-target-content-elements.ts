import {
  getExternalBoxForContainerElementWithMargin, IGetExternalBoxForContainerElementWithMarginOptions
} from './get-external-box-for-container-element-with-margin';
import {
  getTargetBoxForTargetElementWithMargin, IGetTargetBoxForTargetElementWithMarginOptions
} from './get-target-box-for-target-element-with-margin';
import { ISize } from '../../../../../../../misc/types/size/size.type';
import { IPositionAndSize } from '../../../../../../../misc/types/position-and-size/position-and-size.type';
import { fitBoxRelativeToTargetBoxWith$BottomLeft$TopLeftPreference } from './fit-box-relative-to-target-box';

export interface IGetPositionAndSizeSubscribeFunctionForSimpleOverlayAOptions extends
  //
  IGetExternalBoxForContainerElementWithMarginOptions,
  IGetTargetBoxForTargetElementWithMarginOptions
  //
{
  contentElementSize: ISize;
}

export function getFittingBoxForContainer$Target$ContentElements(
  {
    contentElementSize,
    ...options
  }: IGetPositionAndSizeSubscribeFunctionForSimpleOverlayAOptions,
): IPositionAndSize {
  return fitBoxRelativeToTargetBoxWith$BottomLeft$TopLeftPreference(
    getExternalBoxForContainerElementWithMargin(options),
    getTargetBoxForTargetElementWithMargin(options),
    contentElementSize,
  );
}
