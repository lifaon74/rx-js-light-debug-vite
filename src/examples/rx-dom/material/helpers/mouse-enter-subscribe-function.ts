import {
  fromEventTarget, IMapFilterDiscard, IObservable, MAP_FILTER_DISCARD, mapFilter$$, merge
} from '@lifaon/rx-js-light';


export function mouseEnterObservable(
  element: Element,
): IObservable<boolean> {
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
