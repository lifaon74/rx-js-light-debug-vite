import {
  IObservable, IObservablePipe, mapObservablePipe, pipeObservable
} from '@lirx/core';

export function toPercent(value: number): string {
  return `${ value * 100 }%`;
}

export function toPercentObservablePipe(): IObservablePipe<number, string> {
  return mapObservablePipe<number, string>(toPercent);
}

export const toPercent$$$ = toPercentObservablePipe;

export function toPercent$$(
  subscribe: IObservable<number>,
): IObservable<string> {
  return pipeObservable(subscribe, [
    toPercentObservablePipe(),
  ]);
}
