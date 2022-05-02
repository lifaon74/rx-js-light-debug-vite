import { ISize } from '../../../../../../misc/types/size/size.type';
import { getElementSizeFromRect } from './get-element-size-from-rect';

export function getElementSizeFromResizeObserverEntry(
  entry: ResizeObserverEntry,
): ISize {
  return getElementSizeFromRect(entry.contentRect);
}
