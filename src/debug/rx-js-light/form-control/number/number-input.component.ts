import { IMulticastReplayLastSource, ISubscribeFunction } from '@lifaon/rx-js-light';
import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, Input, OnCreate, OnInit, setReactiveClass
} from '@lifaon/rx-dom';
import { const$$, let$$, map$$, map$$$, mergeAll$$, pipe$$, shareR$$$ } from '@lifaon/rx-js-light-shortcuts';
import { INumberInputValue, NumberInputValidity } from './number-input-validity';
// @ts-ignore
import style from './number-input.component.scss';

/** COMPONENT **/

interface IData {
  $value$: IMulticastReplayLastSource<string>;
  disabled$: ISubscribeFunction<boolean>;
  required$: ISubscribeFunction<boolean>;
  min$: ISubscribeFunction<number>;
  max$: ISubscribeFunction<number>;
  step$: ISubscribeFunction<number>;
  validity: {
    badInputText$: ISubscribeFunction<string>;
    rangeUnderflowText$: ISubscribeFunction<string>;
    rangeOverflowText$: ISubscribeFunction<string>;
    stepMismatchText$: ISubscribeFunction<string>;
    valueMissingText$: ISubscribeFunction<string>;
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
      type="number"
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
  style: compileReactiveCSSAsComponentStyle(style),
})
export class AppNumberInputComponent extends HTMLElement implements OnCreate<IData>, OnInit {
  @Input((instance: AppNumberInputComponent) => instance._$disabled$)
  disabled$!: ISubscribeFunction<boolean>;


  @Input((instance: AppNumberInputComponent) => instance._$required$)
  required$!: ISubscribeFunction<boolean>;

  @Input((instance: AppNumberInputComponent) => instance._$min$)
  min$!: ISubscribeFunction<number>;

  @Input((instance: AppNumberInputComponent) => instance._$max$)
  max$!: ISubscribeFunction<number>;

  @Input((instance: AppNumberInputComponent) => instance._$step$)
  step$!: ISubscribeFunction<number>;

  readonly validity: NumberInputValidity;
  readonly numberValue$: ISubscribeFunction<INumberInputValue>;

  protected readonly _data: IData;

  protected _pristine: boolean;

  protected readonly _$value$: IMulticastReplayLastSource<string>;
  protected readonly _$disabled$: IMulticastReplayLastSource<ISubscribeFunction<boolean>>;
  protected readonly _$required$: IMulticastReplayLastSource<ISubscribeFunction<boolean>>;
  protected readonly _$min$: IMulticastReplayLastSource<ISubscribeFunction<number>>;
  protected readonly _$max$: IMulticastReplayLastSource<ISubscribeFunction<number>>;
  protected readonly _$step$: IMulticastReplayLastSource<ISubscribeFunction<number>>;

  constructor() {
    super();
    const $value$ = let$$<string>('');
    this._$value$ = $value$;

    const value$ = pipe$$($value$.subscribe, [
      map$$$<string, INumberInputValue>((value: string): INumberInputValue => ((value === '') ? null : Number(value))),
      shareR$$$<INumberInputValue>(),
    ]);
    this.numberValue$ = value$;

    // TODO is pristine until focused instead ?
    this._pristine = true;
    const pristine$ = pipe$$($value$.subscribe, [
      map$$$<string, boolean>((value: string): boolean => {
        if (this._pristine && (value !== '')) {
          this._pristine = false;
        }
        return this._pristine;
      }),
      shareR$$$<boolean>(),
    ]);

    this._$required$ = let$$(const$$<boolean>(false));
    const required$ = mergeAll$$(this._$required$.subscribe, 1);

    this._$disabled$ = let$$(const$$<boolean>(false));
    const disabled$ = mergeAll$$(this._$disabled$.subscribe, 1);

    this._$min$ = let$$(const$$<number>(Number.NEGATIVE_INFINITY));
    const min$ = mergeAll$$(this._$min$.subscribe, 1);

    this._$max$ = let$$(const$$<number>(Number.POSITIVE_INFINITY));
    const max$ = mergeAll$$(this._$max$.subscribe, 1);

    this._$step$ = let$$(const$$<number>(0));
    const step$ = mergeAll$$(this._$step$.subscribe, 1);

    this.validity = new NumberInputValidity({
      value$,
      required$,
      min$,
      max$,
      step$,
    });

    const badInputText$ = const$$(`Bad input`);
    const rangeUnderflowText$ = map$$(min$, (min: number) => `Number must be greater or equal to ${ min }`);
    const rangeOverflowText$ = map$$(max$, (max: number) => `Number must be lower or equal to ${ max }`);
    const stepMismatchText$ = map$$(step$, (step: number) => `Number must be a multiple of ${ step }`);
    const valueMissingText$ = const$$(`Missing value`);

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

  set required(value: boolean) {
    this._$required$.emit(const$$<boolean>(value));
  }

  onCreate(): IData {
    return this._data;
  }

  onInit(): void {

  }

  setValue(value: string): void {
    this._$value$.emit(value);
  }

  reset(): void {
    this._pristine = true;
    this.setValue('');
  }
}
