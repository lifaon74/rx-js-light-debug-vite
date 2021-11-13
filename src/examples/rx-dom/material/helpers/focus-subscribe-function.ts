import { debounceTime$$, fromEventTarget, interval, IObservable, map$$, merge } from '@lifaon/rx-js-light';
import { isElementFocused, isElementOrChildrenFocused } from './is-element-focused';

export function onFocusChangeEventObservable(
  element: Element,
): IObservable<Event> {
  return merge([
    fromEventTarget<'focusin', Event>(element, 'focusin'),
    fromEventTarget<'focusout', Event>(element, 'focusout'),
  ]);
}

export function focusObservable(
  element: Element,
): IObservable<boolean> {
  return map$$<any, boolean>(
    onFocusChangeEventObservable(element),
    (): boolean => {
      return isElementFocused(element);
    },
  );
}

export function focusObservableDebounced(
  element: Element,
  debounceTime: number = 50,
): IObservable<boolean> {
  return debounceTime$$(focusObservable(element), debounceTime);
}

export function isElementOrChildrenFocusedObservable(
  element: Element,
): IObservable<boolean> {
  return map$$<any, boolean>(
    onFocusChangeEventObservable(element),
    (): boolean => {
      return isElementOrChildrenFocused(element);
    },
  );
}

export function isElementOrChildrenFocusedObservableDebounced(
  element: Element,
  debounceTime: number = 50,
): IObservable<boolean> {
  return debounceTime$$(isElementOrChildrenFocusedObservable(element), debounceTime);
}


// export function focusObservable(
//   element: Element,
// ): IObservable<boolean> {
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

// export function focusObservable(
//   element: Element,
// ): IObservable<boolean> {
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
