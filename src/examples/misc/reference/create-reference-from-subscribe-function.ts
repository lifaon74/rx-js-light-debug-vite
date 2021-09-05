import { IReference } from './reference.type';
import { ISubscribeFunction, IUnsubscribeFunction } from '../../../../../rx-js-light/dist';

// WARN EXPERIMENTAL

export type ICreateReferenceFromSubscribeFunctionReturn<GValue> = [
  reference: IReference<GValue>,
  unsubscribe: IUnsubscribeFunction,
];

export function createReferenceFromSubscribeFunction<GValue>(
  subscribe: ISubscribeFunction<GValue>,
  initialValue: GValue,
): ICreateReferenceFromSubscribeFunctionReturn<GValue> {
  return [
    () => initialValue,
    subscribe((value: GValue) => {
      initialValue = value;
    }),
  ];
}
