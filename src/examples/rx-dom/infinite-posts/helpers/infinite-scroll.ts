import {
  filterSubscribePipe, fromEventTarget, IEmitFunction, interval, ISubscribeFunction, mapSubscribePipe, merge,
  periodTimeSubscribePipe,
  pipeSubscribeFunction
} from '@lifaon/rx-js-light';

export interface IInfiniteScrollOptions {
  scrollElement: HTMLElement;
  triggerDistance?: number; // default: 0
  refreshRate?: number; // default: 100ms
}

export function createInfiniteScrollSubscribeFunction(
  options: IInfiniteScrollOptions,
): ISubscribeFunction<void> {
  const scrollElement: HTMLElement = options.scrollElement;
  const triggerDistance: number = (options.triggerDistance === void 0) ? 0 : options.triggerDistance;
  const refreshRate: number = (options.refreshRate === void 0) ? 50 : options.refreshRate;

  return pipeSubscribeFunction(
    merge([
      pipeSubscribeFunction(fromEventTarget(scrollElement, 'scroll'), [
        mapSubscribePipe<Event, void>(() => void 0),
      ]),
      interval(refreshRate),
    ]),
    [
      periodTimeSubscribePipe<void>(refreshRate),
      filterSubscribePipe<void>((): boolean => {
        const bottomDistance: number = scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.offsetHeight;
        return (bottomDistance <= triggerDistance);
      }),
    ],
  );

}



