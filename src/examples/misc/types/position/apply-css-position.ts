import { ICSSPosition } from './css-position.type';

export function applyCSSPosition(
  element: HTMLElement,
  {
    left,
    top,
  }: ICSSPosition,
): void {
  element.style.setProperty('left', left);
  element.style.setProperty('top', top);
}
