/**
 * TODO make available in lirx/dom ?
 */
export function dispatchCustomEvent<GData>(
  node: HTMLElement,
  type: string,
  detail: GData,
): void {
  node.dispatchEvent(new CustomEvent(type, { bubbles: false, detail }));
}
