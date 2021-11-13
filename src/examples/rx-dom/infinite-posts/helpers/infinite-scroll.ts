import {
  filterObservablePipe, fromEventTarget, IObserver, interval, IObservable, mapObservablePipe, merge,
  periodTimeObservablePipe,
  pipeObservable
} from '@lifaon/rx-js-light';

export interface IInfiniteScrollOptions {
  scrollElement: HTMLElement;
  triggerDistance?: number; // default: 0
  refreshRate?: number; // default: 100ms
}

export function createInfiniteScrollObservable(
  options: IInfiniteScrollOptions,
): IObservable<void> {
  const scrollElement: HTMLElement = options.scrollElement;
  const triggerDistance: number = (options.triggerDistance === void 0) ? 0 : options.triggerDistance;
  const refreshRate: number = (options.refreshRate === void 0) ? 50 : options.refreshRate;

  return pipeObservable(
    merge([
      pipeObservable(fromEventTarget(scrollElement, 'scroll', { passive: true }), [
        mapObservablePipe<Event, void>(() => void 0),
      ]),
      interval(refreshRate),
    ]),
    [
      periodTimeObservablePipe<void>(refreshRate),
      filterObservablePipe<void>((): boolean => {
        const bottomDistance: number = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.offsetHeight;
        return (bottomDistance <= triggerDistance);
      }),
    ],
  );

}



