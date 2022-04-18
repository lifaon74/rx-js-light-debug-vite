import { defineSimpleObservableProperty, IHavingObservableProperty } from '@lirx/dom';
import { IObservable } from '@lirx/core';

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
