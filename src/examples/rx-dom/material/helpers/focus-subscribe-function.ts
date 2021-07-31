import {
  fromEventTarget, IMapFilterDiscard, ISubscribeFunction, MAP_FILTER_DISCARD, merge
} from '@lifaon/rx-js-light';
import { mapFilter$$ } from '@lifaon/rx-js-light-shortcuts';

export function focusSubscribeFunction(
  element: Element,
): ISubscribeFunction<boolean> {
  return merge([
    mapFilter$$<Event, boolean>(
      fromEventTarget<'focusin', Event>(element, 'focusin'),
      (event: Event): boolean | IMapFilterDiscard => {
        return (event.currentTarget === event.target)
          ? true
          : MAP_FILTER_DISCARD;
      },
    ),
    mapFilter$$<Event, boolean>(
      fromEventTarget<'focusout', Event>(element, 'focusout'),
      (event: Event): boolean | IMapFilterDiscard => {
        return (event.currentTarget === event.target)
          ? false
          : MAP_FILTER_DISCARD;
      },
    ),
  ]);
}
