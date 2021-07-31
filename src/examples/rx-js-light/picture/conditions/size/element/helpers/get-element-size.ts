import { ISize } from '../../../../../../misc/types/size/size.type';
import { getElementSizeFromRect } from './get-element-size-from-rect';

export function getElementSize(
  element: Element,
): ISize {
  return getElementSizeFromRect(element.getBoundingClientRect());
}
