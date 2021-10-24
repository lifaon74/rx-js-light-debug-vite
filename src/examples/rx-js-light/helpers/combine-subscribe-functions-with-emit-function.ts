import {
  combineLatest,
  createMulticastSource,
  ICombineLatestSubscribeFunctionsValues, IEmitFunction, IGenericSubscribeFunction, ISource, ISubscribeFunction
} from '@lifaon/rx-js-light';

/** TODO EXPERIMENTAL **/

export interface ICombineSubscribeFunctionsWithEmitFunctionResult<GSubscribeFunctions extends readonly IGenericSubscribeFunction[], GValue> {
  emit: IEmitFunction<GValue>;
  subscribe: ISubscribeFunction<ICombineLatestSubscribeFunctionsValues<[...GSubscribeFunctions, ISubscribeFunction<GValue>]>>;
}

export function combineSubscribeFunctionsWithEmitFunction<GSubscribeFunctions extends readonly IGenericSubscribeFunction[], GValue>(
  subscribeFunctions: GSubscribeFunctions,
  source: ISource<GValue> = createMulticastSource<GValue>(),
): ICombineSubscribeFunctionsWithEmitFunctionResult<GSubscribeFunctions, GValue> {
  return {
    emit: source.emit,
    subscribe: combineLatest<[...GSubscribeFunctions, ISubscribeFunction<GValue>]>([
      ...subscribeFunctions,
      source.subscribe,
    ]),
  };
}
