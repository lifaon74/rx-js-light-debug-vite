import { IReference } from './reference.type';
import { IObservable, IUnsubscribe } from '../../../../../rx-js-light/dist';

// WARN EXPERIMENTAL

export type ICreateReferenceFromObservableReturn<GValue> = [
  reference: IReference<GValue>,
  unsubscribe: IUnsubscribe,
];

export function createReferenceFromObservable<GValue>(
  subscribe: IObservable<GValue>,
  initialValue: GValue,
): ICreateReferenceFromObservableReturn<GValue> {
  return [
    () => initialValue,
    subscribe((value: GValue) => {
      initialValue = value;
    }),
  ];
}
