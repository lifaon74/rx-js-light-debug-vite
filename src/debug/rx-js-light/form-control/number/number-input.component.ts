import { IMulticastReplayLastSource, ISubscribeFunction } from '@lifaon/rx-js-light';
import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, Input, OnCreate, OnInit, setReactiveClass
} from '@lifaon/rx-dom';
import { const$$, let$$, map$$, map$$$, mergeAll$$, pipe$$, shareR$$$ } from '@lifaon/rx-js-light-shortcuts';
import { INumberInputValue, NumberInputValidity } from './number-input-validity';

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
export class AppNumberInputComponent extends HTMLElement implements OnCreate<IData>, OnInit {
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

  protected readonly _$value$: IMulticastReplayLastSource<string>;
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

    this._$required$ = let$$(const$$<boolean>(false));
    const required$ = mergeAll$$(this._$required$.subscribe, 1);

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

    this._data = {
      value: $value$,
    };


    /* SELF UPDATE */

    setReactiveClass(required$, this,'required');
    setReactiveClass(this.validity.valid$, this,'valid');
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

}
