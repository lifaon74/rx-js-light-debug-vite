import {
  defineSimpleObservableProperty, IHavingObservableProperty, setReactiveClass
} from '@lifaon/rx-dom';
import { IObservable } from '@lifaon/rx-js-light';

export type IMatInputClearableProperty = IHavingObservableProperty<'clearable', boolean>;

export function addMatInputClearableProperty(
  target: any,
): IObservable<boolean> {
  return defineSimpleObservableProperty<boolean>(target, 'clearable', true);
}

export function addMatInputClearableClass(
  target: Element & IMatInputClearableProperty,
): void {
  setReactiveClass(target.clearable$, target, 'mat-clearable');
}

export function addMatInputClearableFunctionality(
  target: any,
): IObservable<boolean> {
  const clearable$ = addMatInputClearableProperty(target);
  addMatInputClearableClass(target);
  return clearable$;
}
