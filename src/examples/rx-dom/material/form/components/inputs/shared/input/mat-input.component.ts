import { setComponentSubscribeFunctionProperties, setReactiveClass } from '@lifaon/rx-dom';
import { let$$ } from '@lifaon/rx-js-light-shortcuts';
import { IEmitFunction, ISubscribeFunction, single } from '@lifaon/rx-js-light';


export abstract class MatInputComponent<GValue> extends HTMLElement {
  value$!: ISubscribeFunction<GValue>;
  readonly $value!: IEmitFunction<GValue>;
  value!: GValue;

  readonly$!: ISubscribeFunction<boolean>;
  readonly $readonly!: IEmitFunction<boolean>;
  readonly!: boolean;

  disabled$!: ISubscribeFunction<boolean>;
  readonly $disabled!: IEmitFunction<boolean>;
  disabled!: boolean;

  protected _initialValue: GValue;

  protected constructor(
    initialValue: GValue,
  ) {
    super();
    this._initialValue = initialValue;

    const $value$ = let$$<ISubscribeFunction<GValue>>(single(initialValue));
    setComponentSubscribeFunctionProperties(this, 'value', $value$);

    const $readonly$ = let$$<ISubscribeFunction<boolean>>(single(false));
    setComponentSubscribeFunctionProperties(this, 'readonly', $readonly$);

    const $disabled$ = let$$<ISubscribeFunction<boolean>>(single(false));
    setComponentSubscribeFunctionProperties(this, 'disabled', $disabled$);

    setReactiveClass(this.readonly$, this, 'readonly');
    setReactiveClass(this.disabled$, this, 'disabled');
  }

  reset(): void {
    this.value = this._initialValue;
  }
}
