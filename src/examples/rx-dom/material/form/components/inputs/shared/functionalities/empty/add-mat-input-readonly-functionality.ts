import { setReactiveClass } from '@lirx/dom';
import { IObservable } from '@lirx/core';

export function addMatInputEmptyClass(
  target: Element,
  empty$: IObservable<boolean>,
): void {
  setReactiveClass(empty$, target, 'mat-empty');
}


