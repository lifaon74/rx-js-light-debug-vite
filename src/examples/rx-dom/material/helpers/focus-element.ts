import { isElementFocused } from './is-element-focused';


let FOCUS_QUEUE: Promise<void> = Promise.resolve();

export function focusElement(
  element: HTMLElement,
): Promise<void> {
  return FOCUS_QUEUE = FOCUS_QUEUE.then(() => {
    return focusElementAsync(element);
  });
}


export function focusElementSync(
  element: HTMLElement,
): void {
  element.focus();
  if (
    (element instanceof HTMLInputElement)
    || (element instanceof HTMLTextAreaElement)
  ) {
    element.setSelectionRange(0, 0);
  }
}



export function focusElementAsync(
  element: HTMLElement,
): Promise<void> {
  return new Promise<void>((
    resolve: (value: void | PromiseLike<void>) => void,
    reject: (reason?: any) => void,
  ): void => {
    focusElementSync(element);
    setTimeout(() => {
      if (isElementFocused(element)) {
        resolve();
      } else {
        resolve(focusElementAsync(element));
      }
    }, 0);
  });
}
