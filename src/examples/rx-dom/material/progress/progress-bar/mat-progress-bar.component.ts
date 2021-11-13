import { IObserver, IObservable, single, map$$, let$$, } from '@lifaon/rx-js-light';
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate,
  defineObservableProperty
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-progress-bar.component.html?raw';
// @ts-ignore
import style from './mat-progress-bar.component.scss?inline';


/** COMPONENT **/

interface IData {
  readonly percent$: IObservable<string>;
}

@Component({
  name: 'mat-progress-bar',
  template: compileReactiveHTMLAsGenericComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatProgressBarComponent extends HTMLElement implements OnCreate<IData> {

  progress$!: IObservable<number>;
  readonly $progress!: IObserver<number>;
  progress!: number;

  protected readonly _data: IData;

  constructor() {
    super();

    const $progress$ = let$$<IObservable<number>>(single(0));
    defineObservableProperty(this, 'progress', $progress$);
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
