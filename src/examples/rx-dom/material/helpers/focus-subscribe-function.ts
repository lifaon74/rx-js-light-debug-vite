import { fromEventTarget, interval, ISubscribeFunction, merge } from '@lifaon/rx-js-light';
import { debounce$$, map$$ } from '@lifaon/rx-js-light-shortcuts';
import { isElementFocused, isElementOrChildrenFocused } from './is-element-focused';

export function onFocusChangeEventSubscribeFunction(
  element: Element,
): ISubscribeFunction<Event> {
  return merge([
    fromEventTarget<'focusin', Event>(element, 'focusin'),
    fromEventTarget<'focusout', Event>(element, 'focusout'),
  ]);
}

export function focusSubscribeFunction(
  element: Element,
): ISubscribeFunction<boolean> {
  return map$$<any, boolean>(
    onFocusChangeEventSubscribeFunction(element),
    (): boolean => {
      return isElementFocused(element);
    },
  );
}

export function focusSubscribeFunctionDebounced(
  element: Element,
  debounceTime: number = 50,
): ISubscribeFunction<boolean> {
  return debounce$$(focusSubscribeFunction(element), debounceTime);
}

export function isElementOrChildrenFocusedSubscribeFunction(
  element: Element,
): ISubscribeFunction<boolean> {
  return map$$<any, boolean>(
    onFocusChangeEventSubscribeFunction(element),
    (): boolean => {
      return isElementOrChildrenFocused(element);
    },
  );
}

export function isElementOrChildrenFocusedSubscribeFunctionDebounced(
  element: Element,
  debounceTime: number = 50,
): ISubscribeFunction<boolean> {
  return debounce$$(isElementOrChildrenFocusedSubscribeFunction(element), debounceTime);
}


// export function focusSubscribeFunction(
//   element: Element,
// ): ISubscribeFunction<boolean> {
//   return mapFilter$$<Event, boolean>(
//     merge([
//       fromEventTarget<'focusin', Event>(element, 'focusin'),
//       fromEventTarget<'focusout', Event>(element, 'focusout'),
//     ]),
//     (event: Event): boolean | IMapFilterDiscard => {
//       return (event.currentTarget === event.target)
//         ? isElementFocused(element)
//         : MAP_FILTER_DISCARD;
//     },
//   );
// }

// export function focusSubscribeFunction(
//   element: Element,
// ): ISubscribeFunction<boolean> {
//   return merge([
//     mapFilter$$<Event, boolean>(
//       fromEventTarget<'focusin', Event>(element, 'focusin'),
//       (event: Event): boolean | IMapFilterDiscard => {
//         // console.log('in', document.activeElement);
//         return (event.currentTarget === event.target)
//           ? true
//           : MAP_FILTER_DISCARD;
//       },
//     ),
//     mapFilter$$<Event, boolean>(
//       fromEventTarget<'focusout', Event>(element, 'focusout'),
//       (event: Event): boolean | IMapFilterDiscard => {
//         // console.log('out', document.activeElement);
//         return (event.currentTarget === event.target)
//           ? (document.activeElement === element)
//           : MAP_FILTER_DISCARD;
//       },
//     ),
//   ]);
// }
