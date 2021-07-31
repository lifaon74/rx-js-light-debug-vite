import { IPositionAndSize } from './position-and-size.type';

export function getElementPositionAndSize(
  element: HTMLElement,
): IPositionAndSize {
  return element.getBoundingClientRect();
}
