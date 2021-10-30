// https://stackoverflow.com/questions/19669786/check-if-element-is-visible-in-dom

export function isElementVisible(
  element: HTMLElement,
): boolean {
  // return !!(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
  return (element.offsetWidth > 0) && (element.offsetHeight > 0);
}
