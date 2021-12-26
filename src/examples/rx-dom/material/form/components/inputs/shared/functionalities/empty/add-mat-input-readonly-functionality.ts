import { setReactiveClass } from '@lifaon/rx-dom';
import { IObservable } from '@lifaon/rx-js-light';

export function addMatInputEmptyClass(
  target: Element,
  empty$: IObservable<boolean>,
): void {
  setReactiveClass(empty$, target, 'mat-empty');
}


