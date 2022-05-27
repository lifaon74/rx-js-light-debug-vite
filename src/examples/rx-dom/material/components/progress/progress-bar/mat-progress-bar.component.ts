import { IObservable, map$$ } from '@lirx/core';
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, HTMLElementWithInputs,
  IComponentInput, OnCreate,
} from '@lirx/dom';
// @ts-ignore
import html from './mat-progress-bar.component.html?raw';
// @ts-ignore
import style from './mat-progress-bar.component.scss?inline';


/**
 * COMPONENT: 'mat-progress-bar'
 */

interface IData {
  readonly percent$: IObservable<string>;
  readonly percentText$: IObservable<string>;
}

type IComponentInputs = [
  IComponentInput<'progress', number>,
];

@Component({
  name: 'mat-progress-bar',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatProgressBarComponent extends HTMLElementWithInputs<IComponentInputs>(['progress']) implements OnCreate<IData> {
  protected readonly _data: IData;

  constructor() {
    super();
    this.progress = 0;

    const progress$ = map$$(this.progress$, (progress: number) => Math.min(Math.max(progress, 0), 1));

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
