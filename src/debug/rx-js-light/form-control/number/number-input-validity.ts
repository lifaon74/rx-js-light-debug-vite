import { ISubscribeFunction, single } from '@lifaon/rx-js-light';
import { function$$, map$$, notOrM$$ } from '@lifaon/rx-js-light-shortcuts';
import { isStepValid } from '../misc/number-helpers';
import { distinctDebouncedShared$$ } from '../misc/rx-js-light-helpers';
import { IInputValidityOptions, InputValidity } from '../shared/input-validity';

/** FUNCTIONS **/

export function getStepBaseSubscribeFunction(
  min$: ISubscribeFunction<number>,
): ISubscribeFunction<number> {
  return map$$(min$, getStepBase);
}

export function getStepBase(
  min: number
): number {
  return Number.isFinite(min) ? min : 0;
}

/** TYPES **/

// const numberRegex = /^\s*[+-]?(\d+|\.\d+|\d+\.\d+|\d+\.)(e[+-]?\d+)?\s*$/;

export type INumberInputValue = number | null;

export interface INumberInputValidityOptions extends IInputValidityOptions {
  value$: ISubscribeFunction<INumberInputValue>;
  required$?: ISubscribeFunction<boolean>;
  min$?: ISubscribeFunction<number>;
  max$?: ISubscribeFunction<number>;
  step$?: ISubscribeFunction<number>;
}

/** CLASS **/

export class NumberInputValidity extends InputValidity {
  readonly valid$: ISubscribeFunction<boolean>;

  readonly badInput$: ISubscribeFunction<boolean>;
  readonly rangeUnderflow$: ISubscribeFunction<boolean>;
  readonly rangeOverflow$: ISubscribeFunction<boolean>;
  readonly stepMismatch$: ISubscribeFunction<boolean>;
  readonly valueMissing$: ISubscribeFunction<boolean>;

  constructor(
    {
      value$,
      required$ = single<boolean>(false),
      min$ = single<number>(Number.NEGATIVE_INFINITY),
      max$ = single<number>(Number.POSITIVE_INFINITY),
      step$ = single<number>(0),
    }: INumberInputValidityOptions,
  ) {
    super();

    const stepBase$ = getStepBaseSubscribeFunction(min$);

    /** VALIDITY **/

    const badInput$ = map$$(value$, (value: INumberInputValue) => ((value !== null) && !Number.isFinite(value)));
    this.badInput$ = distinctDebouncedShared$$(badInput$);

    const rangeUnderflow$ = function$$(
      [value$, min$],
      (value: INumberInputValue, min: number): boolean => ((value !== null) && (value < min)),
    );
    this.rangeUnderflow$ = distinctDebouncedShared$$(rangeUnderflow$);

    const rangeOverflow$ = function$$(
      [value$, max$],
      (value: INumberInputValue, max: number): boolean => ((value !== null) && (value > max)),
    );
    this.rangeOverflow$ = distinctDebouncedShared$$(rangeOverflow$);

    const stepMismatch$ = function$$(
      [value$, step$, stepBase$],
      (value: INumberInputValue, step: number, stepBase: number): boolean => {
        return (
          (value !== null)
          && Number.isFinite(value)
          && !isStepValid(value, step, stepBase)
        );
      },
    );
    this.stepMismatch$ = distinctDebouncedShared$$(stepMismatch$);

    const valueMissing$ = function$$(
      [value$, required$],
      (value: INumberInputValue, required: boolean): boolean => (required && (value === null)),
    );
    this.valueMissing$ = distinctDebouncedShared$$(valueMissing$);


    const valid$ = notOrM$$(
      badInput$,
      rangeUnderflow$,
      rangeOverflow$,
      stepMismatch$,
      valueMissing$,
    );
    // const valid$ = function$$(
    //   [
    //     // badInput$,
    //     // rangeUnderflow$,
    //     // rangeOverflow$,
    //     // stepMismatch$,
    //     // valueMissing$,
    //     this.badInput$,
    //     this.rangeUnderflow$,
    //     this.rangeOverflow$,
    //     this.stepMismatch$,
    //     this.valueMissing$,
    //   ],
    //   (...values: boolean[]): boolean => {
    //     for (let i = 0, l = values.length; i < l; i++) {
    //       if (values[i]) {
    //         return false;
    //       }
    //     }
    //     return true;
    //   },
    // );
    this.valid$ = distinctDebouncedShared$$(valid$);
  }
}
