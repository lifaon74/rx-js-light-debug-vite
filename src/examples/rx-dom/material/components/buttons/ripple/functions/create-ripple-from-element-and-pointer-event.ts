import { createRipple, ICreateRippleOptions, IRipple } from './create-ripple';

export interface ICreateRippleFromElementAndPointerEventOptions extends Omit<ICreateRippleOptions, 'x' | 'y' | 'radius'> {
  element: HTMLElement;
  event: PointerEvent;
}

export function createRippleFromElementAndPointerEvent(
  {
    element,
    event,
    ...options
  }: ICreateRippleFromElementAndPointerEventOptions,
): IRipple {
  const clientRect: DOMRect = element.getBoundingClientRect();

  const x: number = event.clientX - clientRect.x;
  const y: number = event.clientY - clientRect.y;
  const radius: number = Math.max(clientRect.width, clientRect.height);

  return createRipple({
    ...options,
    x,
    y,
    radius,
  });
}



// export function createRippleFromElement(
//   element: HTMLElement,
//   x: number,
//   y: number,
// ): IRipple {
//   const clientRect: DOMRect = element.getBoundingClientRect();
//   const radius: number = Math.max(clientRect.width, clientRect.height)
//
//   return createRipple({
//     x,
//     y,
//     radius,
//   });
// }


