import { IMulticastReplayLastSource, ISubscribeFunction, single } from '@lifaon/rx-js-light';
import { let$$, letU$$, mergeAllS$$ } from '@lifaon/rx-js-light-shortcuts';

export type ICreateHigherOrderVariable<GValue> = [
  source: IMulticastReplayLastSource<ISubscribeFunction<GValue>>,
  subscribe: ISubscribeFunction<GValue>,
];

export function createHigherOrderVariable<GValue>(
  initialValue: GValue,
): ICreateHigherOrderVariable<GValue> {
  const source: IMulticastReplayLastSource<ISubscribeFunction<GValue>> = let$$<ISubscribeFunction<GValue>>(single<GValue>(initialValue));
  return [
    source,
    mergeAllS$$(source.subscribe),
  ];
}

export function createHigherOrderVariableUninitialized<GValue>(): ICreateHigherOrderVariable<GValue> {
  const source: IMulticastReplayLastSource<ISubscribeFunction<GValue>> = letU$$<ISubscribeFunction<GValue>>();
  return [
    source,
    mergeAllS$$(source.subscribe),
  ];
}
