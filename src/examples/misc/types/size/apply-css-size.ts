import { ICSSSize } from './css-size.type';

export function applyCSSSize(
  element: HTMLElement,
  {
    width,
    height,
  }: ICSSSize,
): void {
  element.style.setProperty('width', width);
  element.style.setProperty('height', height);
}
