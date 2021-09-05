import { parseCSSTimeLegacy } from './parse-css-time-legacy';

export function getElementTransitionDuration(
  node: Element,
): number | null {
  return parseCSSTimeLegacy(getComputedStyle(node).getPropertyValue('transition-duration'));
}
