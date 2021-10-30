import { IEmitFunction, ISubscribeFunction, single, } from '@lifaon/rx-js-light';
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate,
  setComponentSubscribeFunctionProperties
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-progress-bar.component.html?raw';
// @ts-ignore
import style from './mat-progress-bar.component.scss?inline';
import { let$$, map$$ } from '@lifaon/rx-js-light-shortcuts';


/** COMPONENT **/

interface IData {
  readonly percent$: ISubscribeFunction<string>;
}

@Component({
  name: 'mat-progress-bar',
  template: compileReactiveHTMLAsGenericComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatProgressBarComponent extends HTMLElement implements OnCreate<IData> {

  progress$!: ISubscribeFunction<number>;
  readonly $progress!: IEmitFunction<number>;
  progress!: number;

  protected readonly _data: IData;

  constructor() {
    super();

    const $progress$ = let$$<ISubscribeFunction<number>>(single(0));
    setComponentSubscribeFunctionProperties(this, 'progress', $progress$);
    const progress$ = this.progress$;

    const percent$ = map$$(progress$, (progress: number) => `${ Math.round(progress * 100) }%`);

    this._data = {
      percent$,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}
