import {
  IObserver, IMulticastReplayLastSource, IObservable, single, let$$, mergeAllS$$,
} from '@lirx/core';

/**
 * @deprecated
 */
export type ICreateHigherOrderVariable<GValue> = [
  source: IMulticastReplayLastSource<IObservable<GValue>>,
  subscribe: IObservable<GValue>,
  emit: IObserver<GValue>,
];

/**
 * @deprecated
 */
export function createHigherOrderVariable<GValue>(
  initialValue: GValue,
): ICreateHigherOrderVariable<GValue> {
  const source: IMulticastReplayLastSource<IObservable<GValue>> = let$$<IObservable<GValue>>(single<GValue>(initialValue));
  return [
    source,
    mergeAllS$$(source.subscribe),
    (value: GValue): void => {
      source.emit(single(value));
    },
  ];
}

/**
 * @deprecated
 */
export function createHigherOrderVariableUninitialized<GValue>(): ICreateHigherOrderVariable<GValue> {
  const source: IMulticastReplayLastSource<IObservable<GValue>> = let$$<IObservable<GValue>>();
  return [
    source,
    mergeAllS$$(source.subscribe),
    (value: GValue): void => {
      source.emit(single(value));
    },
  ];
}
