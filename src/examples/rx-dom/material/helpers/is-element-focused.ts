export function isElementFocused(
  element: Element,
): boolean {
  return (document.activeElement === element);
}

export function isElementOrChildrenFocused(
  element: Element,
): boolean {
  return element.contains(document.activeElement);
}
