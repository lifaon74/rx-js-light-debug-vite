import {
  IObserver, IMulticastReplayLastSource, IObservable, single, let$$, mergeAllS$$, letU$$
} from '@lifaon/rx-js-light';

export type ICreateHigherOrderVariable<GValue> = [
  source: IMulticastReplayLastSource<IObservable<GValue>>,
  subscribe: IObservable<GValue>,
  emit: IObserver<GValue>,
];

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

export function createHigherOrderVariableUninitialized<GValue>(): ICreateHigherOrderVariable<GValue> {
  const source: IMulticastReplayLastSource<IObservable<GValue>> = letU$$<IObservable<GValue>>();
  return [
    source,
    mergeAllS$$(source.subscribe),
    (value: GValue): void => {
      source.emit(single(value));
    },
  ];
}
