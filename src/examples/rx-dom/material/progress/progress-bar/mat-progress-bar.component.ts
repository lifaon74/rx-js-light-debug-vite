import { IObservable, map$$ } from '@lifaon/rx-js-light';
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, componentInput$$,
  IComponentInput, OnCreate,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-progress-bar.component.html?raw';
// @ts-ignore
import style from './mat-progress-bar.component.scss?inline';
import { Input } from '../../../__misc/define-component-input';


/** COMPONENT **/

interface IData {
  readonly percent$: IObservable<string>;
  readonly percentText$: IObservable<string>;
}

@Component({
  name: 'mat-progress-bar',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatProgressBarComponent extends HTMLElement implements OnCreate<IData> {
  @Input(0)
  readonly progress!: IComponentInput<number>;

  protected readonly _data: IData;

  constructor() {
    super();
    // this.progress = componentInput$$(0);
    // defineComponentInput(this, 'progress', { initialValue: 5 });
    // defineComponentInput$$(this, 'progress', 5);
    // defineComponentInputU$$<number, 'progress', this>(this, 'progress');

    const progress$ = map$$(this.progress.value$, (progress: number) => Math.min(Math.max(progress, 0), 1));

    const percent$ = map$$(progress$, (progress: number) => `${progress * 100}%`);
    const percentText$ = map$$(progress$, (progress: number) => `${Math.round(progress * 100)}%`);

    this._data = {
      percent$,
      percentText$,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}
