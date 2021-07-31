import { parseCSSTime } from './parse-css-time';

export function getElementTransitionDuration(
  node: Element,
): number | null {
  return parseCSSTime(getComputedStyle(node).getPropertyValue('transition-duration'));
}
