import {
  fromEventTarget, IMapFilterDiscard, ISubscribeFunction, MAP_FILTER_DISCARD, merge
} from '@lifaon/rx-js-light';
import { mapFilter$$ } from '@lifaon/rx-js-light-shortcuts';

export function mouseEnterSubscribeFunction(
  element: Element,
): ISubscribeFunction<boolean> {
  return merge([
    mapFilter$$<MouseEvent, boolean>(
      fromEventTarget<'mouseenter', MouseEvent>(element, 'mouseenter'),
      (event: MouseEvent): boolean | IMapFilterDiscard => {
        return (event.currentTarget === event.target)
          ? true
          : MAP_FILTER_DISCARD;
      },
    ),
    mapFilter$$<MouseEvent, boolean>(
      fromEventTarget<'mouseleave', MouseEvent>(element, 'mouseleave'),
      (event: MouseEvent): boolean | IMapFilterDiscard => {
        return (event.currentTarget === event.target)
          ? false
          : MAP_FILTER_DISCARD;
      },
    ),
  ]);
}
