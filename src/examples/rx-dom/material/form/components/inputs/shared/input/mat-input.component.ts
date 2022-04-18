import { defineObservableProperty, setReactiveClass } from '@lirx/dom';
import { IObservable, IObserver, let$$, single } from '@lirx/core';
import { addMatInputReadonlyFunctionality } from '../functionalities/readonly/add-mat-input-readonly-functionality';
import { addMatInputDisabledFunctionality } from '../functionalities/disabled/add-mat-input-disabled-functionality';

/**
 * @deprecated
 */
export abstract class MatInputComponent<GValue> extends HTMLElement {
  value$!: IObservable<GValue>;
  readonly $value!: IObserver<GValue>;
  value!: GValue;

  readonly$!: IObservable<boolean>;
  readonly $readonly!: IObserver<boolean>;
  readonly!: boolean;

  disabled$!: IObservable<boolean>;
  readonly $disabled!: IObserver<boolean>;
  disabled!: boolean;

  protected _initialValue: GValue;

  protected constructor(
    initialValue: GValue,
  ) {
    super();
    this._initialValue = initialValue;

    addMatInputReadonlyFunctionality(this);
    addMatInputDisabledFunctionality(this);

    const $value$ = let$$<IObservable<GValue>>(single(initialValue));
    defineObservableProperty(this, 'value', $value$);
  }

  reset(): void {
    this.value = this._initialValue;
  }
}
