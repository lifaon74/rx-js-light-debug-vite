import {
  ISubscribeFunction, ISubscribePipeFunction, mapSubscribePipe, pipeSubscribeFunction
} from '@lifaon/rx-js-light';

export function toPercent(value: number): string {
  return `${ value * 100 }%`;
}

export function toPercentSubscribePipe(): ISubscribePipeFunction<number, string> {
  return mapSubscribePipe<number, string>(toPercent);
}

export const toPercent$$$ = toPercentSubscribePipe;

export function toPercent$$(
  subscribe: ISubscribeFunction<number>,
): ISubscribeFunction<string> {
  return pipeSubscribeFunction(subscribe, [
    toPercentSubscribePipe(),
  ]);
}
