import { ICSSPositionAndSize } from './css-position-and-size.type';
import { applyCSSPosition } from '../position/apply-css-position';
import { applyCSSSize } from '../size/apply-css-size';

export function applyCSSPositionAndSize(
  element: HTMLElement,
  positionAndSize: ICSSPositionAndSize,
): void {
  applyCSSPosition(element, positionAndSize);
  applyCSSSize(element, positionAndSize);
}
