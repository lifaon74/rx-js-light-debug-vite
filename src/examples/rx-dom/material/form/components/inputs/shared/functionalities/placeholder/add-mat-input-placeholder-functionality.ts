import { defineSimpleObservableProperty, IHavingObservableProperty } from '@lifaon/rx-dom';
import { IObservable } from '@lifaon/rx-js-light';

export type IMatInputPlaceholderProperty = IHavingObservableProperty<'placeholder', string>;

export function addMatInputPlaceholderProperty(
  target: any,
): IObservable<string> {
  return defineSimpleObservableProperty<string>(target, 'placeholder', '');
}

export function addMatInputPlaceholderFunctionality(
  target: any,
): IObservable<string> {
  return addMatInputPlaceholderProperty(target);
}
