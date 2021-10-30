import { getDocument } from '@lifaon/rx-dom';

export function getActiveElement(): Element | null {
  return getDocument().activeElement;
}

export function isElementFocused(
  element: Element,
): boolean {
  return (getActiveElement() === element);
}

export function isElementOrChildrenFocused(
  element: Element,
): boolean {
  return element.contains(getActiveElement());
}
