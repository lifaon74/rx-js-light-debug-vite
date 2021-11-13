import {
  combineLatest,
  createMulticastSource,
  ICombineLatestObservablesValues, IObserver, IGenericObservable, ISource, IObservable
} from '@lifaon/rx-js-light';

/** TODO EXPERIMENTAL **/

export interface ICombineObservablesWithObserverResult<GObservables extends readonly IGenericObservable[], GValue> {
  emit: IObserver<GValue>;
  subscribe: IObservable<ICombineLatestObservablesValues<[...GObservables, IObservable<GValue>]>>;
}

export function combineObservablesWithObserver<GObservables extends readonly IGenericObservable[], GValue>(
  subscribeFunctions: GObservables,
  source: ISource<GValue> = createMulticastSource<GValue>(),
): ICombineObservablesWithObserverResult<GObservables, GValue> {
  return {
    emit: source.emit,
    subscribe: combineLatest<[...GObservables, IObservable<GValue>]>([
      ...subscribeFunctions,
      source.subscribe,
    ]),
  };
}
