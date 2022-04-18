import { extendWithHigherOrderObservableView$, setReactiveClass } from '@lirx/dom';
import { IHigherOrderObservableView, IObserverObservableTuple } from '@lirx/core';

const MAT_INPUT_READONLY_PROPERTY_NAME = 'readonly';

type IMatInputReadonlyPropertyName = typeof MAT_INPUT_READONLY_PROPERTY_NAME;

export type IMatInputReadonlyProperty = IHigherOrderObservableView<IMatInputReadonlyPropertyName, boolean>;

export function addMatInputReadonlyProperty(
  target: any,
): IObserverObservableTuple<boolean> {
  return extendWithHigherOrderObservableView$<any, IMatInputReadonlyPropertyName, boolean>(
    target,
    MAT_INPUT_READONLY_PROPERTY_NAME,
    false,
  );
}

export function addMatInputReadonlyClass(
  target: Element & IMatInputReadonlyProperty,
): void {
  setReactiveClass(target.readonly$, target, 'mat-readonly');
}

export function addMatInputReadonlyFunctionality(
  target: any,
): IObserverObservableTuple<boolean> {
  const tuple = addMatInputReadonlyProperty(target);
  addMatInputReadonlyClass(target);
  return tuple;
}
