import {
  defineSimpleObservableProperty, IHavingObservableProperty, setReactiveClass
} from '@lifaon/rx-dom';
import { IObservable } from '@lifaon/rx-js-light';

export type IMatInputDisabledProperty = IHavingObservableProperty<'disabled', boolean>;

export function addMatInputDisabledProperty(
  target: any,
): IObservable<boolean> {
  return defineSimpleObservableProperty<boolean>(target, 'disabled', false);
}

export function addMatInputDisabledClass(
  target: Element & IMatInputDisabledProperty,
): void {
  setReactiveClass(target.disabled$, target, 'mat-disabled');
}

export function addMatInputDisabledFunctionality(
  target: any,
): IObservable<boolean> {
  const disabled$ = addMatInputDisabledProperty(target);
  addMatInputDisabledClass(target);
  return disabled$;
}
