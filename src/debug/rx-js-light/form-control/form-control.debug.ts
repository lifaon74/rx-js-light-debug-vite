import {
  createMulticastReplayLastSource,
  fromEventTarget, IMapFunction, IMulticastReplayLastSource, ISubscribeFunction, ISubscribePipeFunction
} from '@lifaon/rx-js-light';
import {
  bootstrap, compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, Input, OnCreate
} from '@lifaon/rx-dom';
import {
  const$$, debounce$$, debounce$$$, distinct$$$, function$$, let$$, map$$, map$$$, mergeAll$$, notOrM$$, pipe$$,
  pipe$$$, share$$$
} from '@lifaon/rx-js-light-shortcuts';

const createAndAppendElement = <K extends keyof HTMLElementTagNameMap>(tagName: K) => document.body.appendChild(document.createElement(tagName));


type INumberInputValue = number | null;

// interface ValidityState {
//   readonly badInput: boolean;
//   readonly customError: boolean;
//   readonly patternMismatch: boolean;
//   readonly rangeOverflow: boolean;
//   readonly rangeUnderflow: boolean;
//   readonly stepMismatch: boolean;
//   readonly tooLong: boolean;
//   readonly tooShort: boolean;
//   readonly typeMismatch: boolean;
//   readonly valid: boolean;
//   readonly valueMissing: boolean;
// }


function floatEquals(
  a: number,
  b: number,
  precision: number = 1e-6,
): boolean {
  return Math.abs(a - b) < precision;
}

function isNonNullStepValid(
  value: number,
  step: number,
  stepBase: number,
): boolean {
  const a: number = (value - stepBase) / step;
  return floatEquals(a, Math.round(a));
}

function isStepValid(
  value: number,
  step: number,
  stepBase: number,
): boolean {
  return (step === 0) || isNonNullStepValid(value, step, stepBase);
}

function distinctShared$$$<GValue>(): ISubscribePipeFunction<GValue, GValue> {
  return pipe$$$([
    distinct$$$<GValue>(),
    share$$$<GValue>(),
  ]);
}

function distinctShared$$<GValue>(
  subscribeFunction: ISubscribeFunction<GValue>
): ISubscribeFunction<GValue> {
  return distinctShared$$$<GValue>()(subscribeFunction);
}

function distinctDebouncedShared$$$<GValue>(): ISubscribePipeFunction<GValue, GValue> {
  return pipe$$$([
    distinct$$$<GValue>(),
    debounce$$$<GValue>(0),
    share$$$<GValue>(createMulticastReplayLastSource),
  ]);
}


function distinctDebouncedShared$$<GValue>(
  subscribeFunction: ISubscribeFunction<GValue>
): ISubscribeFunction<GValue> {
  return distinctDebouncedShared$$$<GValue>()(subscribeFunction);
}


/** CONTROLLER **/

class NumberInputValidity1 {
  @Input((instance: NumberInputValidity1) => instance._value)
  value$!: ISubscribeFunction<INumberInputValue>;

  @Input((instance: NumberInputValidity1) => instance._required)
  required$!: ISubscribeFunction<boolean>;

  @Input((instance: NumberInputValidity1) => instance._min)
  min$!: ISubscribeFunction<number>;

  @Input((instance: NumberInputValidity1) => instance._max)
  max$!: ISubscribeFunction<number>;

  @Input((instance: NumberInputValidity1) => instance._step)
  step$!: ISubscribeFunction<number>;

  readonly pristine$: ISubscribeFunction<boolean>;

  // validity state
  readonly badInput$: ISubscribeFunction<boolean>;
  readonly rangeUnderflow$: ISubscribeFunction<boolean>;
  readonly rangeOverflow$: ISubscribeFunction<boolean>;
  readonly stepMismatch$: ISubscribeFunction<boolean>;
  readonly valid$: ISubscribeFunction<boolean>;
  readonly valueMissing$: ISubscribeFunction<boolean>;

  protected readonly _value: IMulticastReplayLastSource<ISubscribeFunction<INumberInputValue>>;
  protected readonly _required: IMulticastReplayLastSource<ISubscribeFunction<boolean>>;
  protected readonly _min: IMulticastReplayLastSource<ISubscribeFunction<number>>;
  protected readonly _max: IMulticastReplayLastSource<ISubscribeFunction<number>>;
  protected readonly _step: IMulticastReplayLastSource<ISubscribeFunction<number>>;


  constructor() {
    /** INPUTS **/
    this._value = let$$(const$$<INumberInputValue>(0));
    const value$ = mergeAll$$(this._value.subscribe, 1);

    this._required = let$$(const$$<boolean>(false));
    const required$ = mergeAll$$(this._required.subscribe, 1);

    this._min = let$$(const$$<number>(Number.NEGATIVE_INFINITY));
    const min$ = mergeAll$$(this._min.subscribe, 1);

    this._max = let$$(const$$<number>(Number.POSITIVE_INFINITY));
    const max$ = mergeAll$$(this._max.subscribe, 1);

    this._step = let$$(const$$<number>(0));
    const step$ = mergeAll$$(this._step.subscribe, 1);

    const stepBase$ = map$$(min$, (min: number) => (Number.isFinite(min) ? min : 0));

    /** VALIDITY **/

    const badInput$ = map$$(value$, (value: INumberInputValue) => ((value !== null) && !Number.isFinite(value)));
    this.badInput$ = distinctShared$$(badInput$);

    const rangeUnderflow$ = function$$(
      (value: INumberInputValue, min: number): boolean => ((value !== null) && (value < min)),
      [value$, min$],
    );
    this.rangeUnderflow$ = distinctShared$$(rangeUnderflow$);

    const rangeOverflow$ = function$$(
      (value: INumberInputValue, max: number): boolean => ((value !== null) && (value > max)),
      [value$, max$],
    );
    this.rangeOverflow$ = distinctShared$$(rangeOverflow$);

    const stepMismatch$ = function$$(
      (value: INumberInputValue, step: number, stepBase: number): boolean => {
        return (
          (value !== null)
          && !isStepValid(value, step, stepBase)
        );
      },
      [value$, step$, stepBase$],
    );
    this.stepMismatch$ = distinctShared$$(stepMismatch$);

    const valueMissing$ = function$$(
      (value: INumberInputValue, required: boolean): boolean => (required && (value === null)),
      [value$, required$],
    );
    this.valueMissing$ = distinctShared$$(valueMissing$);

    // const $valid = function$$(
    //   (...values: boolean[]): boolean => {
    //     for (let i = 0, l = values.length; i < l; i++) {
    //       if (values[i]) {
    //         return false;
    //       }
    //     }
    //     return true;
    //   },
    //   [
    //     this.badInput$,
    //     this.rangeUnderflow$,
    //     this.rangeOverflow$,
    //     this.stepMismatch$,
    //     this.valueMissing$,
    //   ],
    // );
    const $valid = notOrM$$(
      this.badInput$,
      this.rangeUnderflow$,
      this.rangeOverflow$,
      this.stepMismatch$,
      this.valueMissing$,
    );
    this.valid$ = distinctShared$$($valid);

    const pristine$ = map$$(value$, (value: INumberInputValue): boolean => (value === null));
    this.pristine$ = distinctShared$$(pristine$);
  }
}


interface INumberInputValidityOptions {
  value$: ISubscribeFunction<INumberInputValue>;
  required$?: ISubscribeFunction<boolean>;
  min$?: ISubscribeFunction<number>;
  max$?: ISubscribeFunction<number>;
  step$?: ISubscribeFunction<number>;
}

class NumberInputValidity {
  readonly badInput$: ISubscribeFunction<boolean>;
  readonly rangeUnderflow$: ISubscribeFunction<boolean>;
  readonly rangeOverflow$: ISubscribeFunction<boolean>;
  readonly stepMismatch$: ISubscribeFunction<boolean>;
  readonly valid$: ISubscribeFunction<boolean>;
  readonly valueMissing$: ISubscribeFunction<boolean>;

  constructor(
    {
      value$,
      required$ = const$$<boolean>(false),
      min$ = const$$<number>(Number.NEGATIVE_INFINITY),
      max$ = const$$<number>(Number.POSITIVE_INFINITY),
      step$ = const$$<number>(0),
    }: INumberInputValidityOptions,
  ) {
    const stepBase$ = map$$(min$, (min: number) => (Number.isFinite(min) ? min : 0));

    /** VALIDITY **/

    const badInput$ = map$$(value$, (value: INumberInputValue) => ((value !== null) && !Number.isFinite(value)));
    this.badInput$ = distinctDebouncedShared$$(badInput$);

    const rangeUnderflow$ = function$$(
      (value: INumberInputValue, min: number): boolean => ((value !== null) && (value < min)),
      [value$, min$],
    );
    this.rangeUnderflow$ = distinctDebouncedShared$$(rangeUnderflow$);

    const rangeOverflow$ = function$$(
      (value: INumberInputValue, max: number): boolean => ((value !== null) && (value > max)),
      [value$, max$],
    );
    this.rangeOverflow$ = distinctDebouncedShared$$(rangeOverflow$);

    const stepMismatch$ = function$$(
      (value: INumberInputValue, step: number, stepBase: number): boolean => {
        return (
          (value !== null)
          && !isStepValid(value, step, stepBase)
        );
      },
      [value$, step$, stepBase$],
    );
    this.stepMismatch$ = distinctDebouncedShared$$(stepMismatch$);

    const valueMissing$ = function$$(
      (value: INumberInputValue, required: boolean): boolean => (required && (value === null)),
      [value$, required$],
    );
    this.valueMissing$ = distinctDebouncedShared$$(valueMissing$);

    // const $valid = notOrM$$(
    //   this.badInput$,
    //   this.rangeUnderflow$,
    //   this.rangeOverflow$,
    //   this.stepMismatch$,
    //   this.valueMissing$,
    // );
    const $valid = function$$(
      (...values: boolean[]): boolean => {
        for (let i = 0, l = values.length; i < l; i++) {
          if (values[i]) {
            return false;
          }
        }
        return true;
      },
      [
        this.badInput$,
        this.rangeUnderflow$,
        this.rangeOverflow$,
        this.stepMismatch$,
        this.valueMissing$,
      ],
    );
    this.valid$ = distinctDebouncedShared$$($valid);
  }
}


/** COMPONENT **/

interface IData {
  value: IMulticastReplayLastSource<string>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-number-input',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <input
      #input
      [value]="$.value.subscribe"
      (input)="() => $.value.emit(input.value)"
    >
  `, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
    }
  `),
})
export class AppNumberInputComponent extends HTMLElement implements OnCreate<IData> {
  @Input((instance: AppNumberInputComponent) => instance._required)
  required$!: ISubscribeFunction<boolean>;

  @Input((instance: AppNumberInputComponent) => instance._min)
  min$!: ISubscribeFunction<number>;

  @Input((instance: AppNumberInputComponent) => instance._max)
  max$!: ISubscribeFunction<number>;

  @Input((instance: AppNumberInputComponent) => instance._step)
  step$!: ISubscribeFunction<number>;

  readonly validity: NumberInputValidity;
  protected readonly data: IData;

  protected readonly _required: IMulticastReplayLastSource<ISubscribeFunction<boolean>>;
  protected readonly _min: IMulticastReplayLastSource<ISubscribeFunction<number>>;
  protected readonly _max: IMulticastReplayLastSource<ISubscribeFunction<number>>;
  protected readonly _step: IMulticastReplayLastSource<ISubscribeFunction<number>>;

  constructor() {
    super();
    const $value$ = let$$<string>('');

    const value$ = pipe$$($value$.subscribe, [
      map$$$<string, INumberInputValue>((value: string): INumberInputValue => ((value === '') ? null : Number(value))),
      share$$$<INumberInputValue>(),
    ]);

    this._required = let$$(const$$<boolean>(false));
    const required$ = mergeAll$$(this._required.subscribe, 1);

    this._min = let$$(const$$<number>(Number.NEGATIVE_INFINITY));
    const min$ = mergeAll$$(this._min.subscribe, 1);

    this._max = let$$(const$$<number>(Number.POSITIVE_INFINITY));
    const max$ = mergeAll$$(this._max.subscribe, 1);

    this._step = let$$(const$$<number>(0));
    const step$ = mergeAll$$(this._step.subscribe, 1);

    this.validity = new NumberInputValidity({
      value$,
      required$,
      min$,
      max$,
      step$,
    });

    this.data = {
      value: $value$,
    };
  }

  set required(value: boolean) {
    this._required.emit(const$$<boolean>(value));
  }

  public onCreate(): IData {
    return this.data;
  }
}


/** DEBUG **/


function formControlDebug1() {

  function inputValueToNumber(inputElement: HTMLInputElement): IMapFunction<any, INumberInputValue> {
    return () => ((inputElement.value === '') ? null : Number(inputElement.value));
    // return () => Number(inputElement.value);
  }

  const inputControl = new NumberInputValidity1();

  const inputElement: HTMLInputElement = createAndAppendElement('input');
  inputElement.type = 'number';


  // inputControl.value$ = map$$(fromEventTarget(inputElement, 'input'), inputValueToNumber(inputElement));
  inputControl.value$ = pipe$$(fromEventTarget(inputElement, 'input'), [
    map$$$<any, INumberInputValue>(inputValueToNumber(inputElement)),
    share$$$<INumberInputValue>(),
  ]);

  inputControl.min$ = const$$(5);
  inputElement.min = '5';

  inputControl.max$ = const$$(10);
  inputElement.max = '10';

  inputControl.step$ = const$$(0.1);
  inputElement.step = '0.1';

  inputControl.required$ = const$$(true);
  inputElement.required = true;

  const checkValidityState = (propertyName: keyof ValidityState, value: boolean) => {
    if (inputElement.validity[propertyName] !== value) {
      // throw new Error(`Incorrect validity state for '${ propertyName }'. Received ${ value }`);
      console.log(`Incorrect validity state for '${ propertyName }'. Received ${ value }`);
    }
  };

  const checkValidity = (propertyName: keyof ValidityState) => {
    const validity$: ISubscribeFunction<boolean> = inputControl[`${ propertyName }$`];
    const validityDebounced$ = debounce$$(validity$, 50);
    validityDebounced$((value: boolean) => {
      // console.log(propertyName, value);
      checkValidityState(propertyName, value);
    });
  };


  inputControl.value$((value: INumberInputValue) => {
    console.log('value', value);
    // console.log(inputElement.validity);
  });

  ([
    'badInput',
    'rangeUnderflow',
    'rangeOverflow',
    'stepMismatch',
    'valueMissing',
    'valid',
  ] as (keyof ValidityState)[]).forEach((propertyName: keyof ValidityState) => {
    checkValidity(propertyName);
  });


  inputControl.pristine$((pristine: boolean) => {
    console.log('pristine', pristine);
  });

}

function formControlDebug2() {
  const input = new AppNumberInputComponent();
  bootstrap(input);

  input.required$ = const$$(true);
  // input.required = true;

  input.validity.valid$((value: boolean) => {
    console.log('valid$', value);
  });

  (window as any).input = input;
  (window as any).const$$ = const$$;
}

/*-------------*/

export function formControlDebug() {
  // formControlDebug1();
  formControlDebug2();
}

