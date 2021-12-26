import {
  IObserver, IMulticastReplayLastSource, IObservable, single, map$$, map$$$, pipe$$, function$$, let$$
} from '@lifaon/rx-js-light';
import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, HTMLElementConstructor, IOnInitOptions, OnCreate, OnInit, setReactiveClass
} from '@lifaon/rx-dom';
import { getStepBaseObservable, INumberInputValue, NumberInputValidity } from './number-input-validity';
// @ts-ignore
import style from './number-input.component.scss';
import { createHigherOrderVariable } from '../../../../examples/misc/create-higher-order-variable';
import { havingMultipleObservableProperties } from '../../../../examples/misc/having-multiple-subscribe-function-properties';
import { createPristineObservable } from '../misc/create-pristine-subscribe-function';


/** COMPONENT **/

type IAppNumberInputComponentInputs = [
  ['disabled', boolean],
  ['required', boolean],
  ['min', number],
  ['max', number],
  ['step', number],
];

interface IData {
  $value$: IMulticastReplayLastSource<string>;
  disabled$: IObservable<boolean>;
  required$: IObservable<boolean>;
  min$: IObservable<number>;
  max$: IObservable<number>;
  step$: IObservable<number>;
  validity: {
    badInputText$: IObservable<string>;
    rangeUnderflowText$: IObservable<string>;
    rangeOverflowText$: IObservable<string>;
    stepMismatchText$: IObservable<string>;
    valueMissingText$: IObservable<string>;
  };
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-number-input',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <input
      #input
      type="text"
      [value]="$.$value$.subscribe"
      (input)="() => $.$value$.emit(getNodeReference('input').value)"
      [disabled]="$.disabled$"
      [required]="$.required$"
      [min]="$.min$"
      [max]="$.max$"
      [step]="$.step$"
    >
    <div class="validity-container">
      <div class="bad-input">
        {{ $.validity.badInputText$ }}
      </div>
      <div class="range-underflow">
        {{ $.validity.rangeUnderflowText$ }}
      </div>
      <div class="range-overflow">
        {{ $.validity.rangeOverflowText$ }}
      </div>
      <div class="step-mismatch">
        {{ $.validity.stepMismatchText$ }}
      </div>
      <div class="value-missing">
        {{ $.validity.valueMissingText$ }}
      </div>
    </div>
  `, CONSTANTS_TO_IMPORT),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppNumberInputComponent extends havingMultipleObservableProperties<IAppNumberInputComponentInputs, HTMLElementConstructor>(HTMLElement) implements OnCreate<IData>, OnInit {
  readonly validity: NumberInputValidity;
  readonly numberValue$: IObservable<INumberInputValue>;

  protected readonly _data: IData;

  protected _resetPristine: IObserver<void>;

  protected readonly _$value$: IMulticastReplayLastSource<string>;

  constructor() {
    const [$disabled$, disabled$] = createHigherOrderVariable(false);
    const [$required$, required$] = createHigherOrderVariable(false);
    const [$min$, min$] = createHigherOrderVariable(Number.NEGATIVE_INFINITY);
    const [$max$, max$] = createHigherOrderVariable(Number.POSITIVE_INFINITY);
    const [$step$, step$] = createHigherOrderVariable(0);

    super([
      ['disabled', $disabled$],
      ['required', $required$],
      ['min', $min$],
      ['max', $max$],
      ['step', $step$],
    ]);

    const $value$ = let$$<string>('');
    this._$value$ = $value$;

    const value$ = pipe$$($value$.subscribe, [
      map$$$<string, INumberInputValue>((value: string): INumberInputValue => ((value === '') ? null : Number(value))),
      shareRL$$$<INumberInputValue>(),
    ]);
    this.numberValue$ = value$;


    const [pristine$, resetPristine] = createPristineObservable($value$.subscribe);
    this._resetPristine = resetPristine;

    const stepBase$ = getStepBaseObservable(min$);

    this.validity = new NumberInputValidity({
      value$,
      required$,
      min$,
      max$,
      step$,
    });

    const badInputText$ = single(`Bad input`);
    const rangeUnderflowText$ = map$$(min$, (min: number) => `Number must be greater or equal to ${ min }`);
    const rangeOverflowText$ = map$$(max$, (max: number) => `Number must be lower or equal to ${ max }`);
    // const stepMismatchText$ = map$$(step$, (step: number) => `Number must be a multiple of ${ step }`);
    const stepMismatchText$ = function$$(
      [step$, stepBase$],
      (step: number, stepBase: number) => {
        return (stepBase === 0)
          ? `Number must be a multiple of ${ step }`
          : `Number must follow this constraint: ${ stepBase } + ${ step } * x`;
      });
    const valueMissingText$ = single(`A value is required`);

    this._data = {
      $value$,
      disabled$,
      required$,
      min$,
      max$,
      step$,
      validity: {
        badInputText$,
        rangeUnderflowText$,
        rangeOverflowText$,
        stepMismatchText$,
        valueMissingText$,
      },
    };


    /* SELF UPDATE */

    setReactiveClass(pristine$, this, 'pristine');
    setReactiveClass(disabled$, this, 'disabled');
    setReactiveClass(required$, this, 'required');
    setReactiveClass(this.validity.badInput$, this, 'bad-input');
    setReactiveClass(this.validity.rangeUnderflow$, this, 'range-underflow');
    setReactiveClass(this.validity.rangeOverflow$, this, 'range-overflow');
    setReactiveClass(this.validity.stepMismatch$, this, 'step-mismatch');
    setReactiveClass(this.validity.valueMissing$, this, 'value-missing');
    setReactiveClass(this.validity.valid$, this, 'valid');
  }

  onCreate(): IData {
    return this._data;
  }

  onInit(options:IOnInitOptions): void {

  }

  setValue(value: string): void {
    this._$value$.emit(value);
  }

  reset(): void {
    this._resetPristine();
    this.setValue('');
  }
}
