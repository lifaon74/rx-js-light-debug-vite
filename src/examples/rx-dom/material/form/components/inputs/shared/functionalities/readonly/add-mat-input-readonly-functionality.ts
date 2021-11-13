import {
  defineSimpleObservableProperty, IHavingObservableProperty, setReactiveClass
} from '@lifaon/rx-dom';
import { IObservable } from '@lifaon/rx-js-light';

export type IMatInputReadonlyProperty = IHavingObservableProperty<'readonly', boolean>;

export function addMatInputReadonlyProperty(
  target: any,
): IObservable<boolean> {
  return defineSimpleObservableProperty<boolean>(target, 'readonly', false);
}

export function addMatInputReadonlyClass(
  target: Element & IMatInputReadonlyProperty,
): void {
  setReactiveClass(target.readonly$, target, 'mat-readonly');
}

export function addMatInputReadonlyFunctionality(
  target: any,
): IObservable<boolean> {
  const readonly$ = addMatInputReadonlyProperty(target);
  addMatInputReadonlyClass(target);
  return readonly$;
}
