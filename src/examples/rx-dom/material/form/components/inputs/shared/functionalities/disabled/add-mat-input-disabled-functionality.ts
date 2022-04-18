import { extendWithHigherOrderObservableView$, setReactiveClass } from '@lirx/dom';
import { IHigherOrderObservableView, IObserverObservableTuple } from '@lirx/core';

const MAT_INPUT_DISABLED_PROPERTY_NAME = 'disabled';

type IMatInputDisabledPropertyName = typeof MAT_INPUT_DISABLED_PROPERTY_NAME;

export type IMatInputDisabledProperty = IHigherOrderObservableView<IMatInputDisabledPropertyName, boolean>;

export function addMatInputDisabledProperty(
  target: any,
): IObserverObservableTuple<boolean> {
  return extendWithHigherOrderObservableView$<any, IMatInputDisabledPropertyName, boolean>(
    target,
    MAT_INPUT_DISABLED_PROPERTY_NAME,
    false,
  );
}

export function addMatInputDisabledClass(
  target: Element & IMatInputDisabledProperty,
): void {
  setReactiveClass(target.disabled$, target, 'mat-disabled');
}

export function addMatInputDisabledFunctionality(
  target: any,
): IObserverObservableTuple<boolean> {
  const tuple = addMatInputDisabledProperty(target);
  addMatInputDisabledClass(target);
  return tuple;
}
