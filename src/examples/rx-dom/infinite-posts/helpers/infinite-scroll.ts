import {
  filterObservablePipe, fromEventTarget, interval, IObservable, merge, pipe$$, throttleTime$$$,
} from '@lirx/core';

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

  return pipe$$(
    merge([
      fromEventTarget(scrollElement, 'scroll', { passive: true }),
      interval(refreshRate),
    ]),
    [
      throttleTime$$$<any>(refreshRate),
      filterObservablePipe<any>((): boolean => {
        const bottomDistance: number = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.offsetHeight;
        return (bottomDistance <= triggerDistance);
      }),
    ],
  );
}



