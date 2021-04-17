import { combineLatest, ISubscribeFunction } from '@lifaon/rx-js-light';
import { const$$, function$$, map$$, notOrM$$ } from '@lifaon/rx-js-light-shortcuts';
import { isStepValid } from '../misc/number-helpers';
import { distinctDebouncedShared$$ } from '../misc/rx-js-light-helpers';
import { IInputValidityOptions, InputValidity } from '../shared/input-validity';

export type INumberInputValue = number | null;

export interface INumberInputValidityOptions extends IInputValidityOptions {
  value$: ISubscribeFunction<INumberInputValue>;
  required$?: ISubscribeFunction<boolean>;
  min$?: ISubscribeFunction<number>;
  max$?: ISubscribeFunction<number>;
  step$?: ISubscribeFunction<number>;
}

export class NumberInputValidity extends InputValidity {
  readonly valid$: ISubscribeFunction<boolean>

  readonly badInput$: ISubscribeFunction<boolean>;
  readonly rangeUnderflow$: ISubscribeFunction<boolean>;
  readonly rangeOverflow$: ISubscribeFunction<boolean>;
  readonly stepMismatch$: ISubscribeFunction<boolean>;
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
    super();

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


    const valid$ = function$$(
      (...values: boolean[]): boolean => {
        for (let i = 0, l = values.length; i < l; i++) {
          if (values[i]) {
            return false;
          }
        }
        return true;
      },
      [
        // badInput$,
        // rangeUnderflow$,
        // rangeOverflow$,
        // stepMismatch$,
        // valueMissing$,
        this.badInput$,
        this.rangeUnderflow$,
        this.rangeOverflow$,
        this.stepMismatch$,
        this.valueMissing$,
      ],
    );
    this.valid$ = distinctDebouncedShared$$(valid$);
  }
}
