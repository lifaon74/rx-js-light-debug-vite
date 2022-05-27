import { function$$, IObservable, map$$ } from '@lirx/core';
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, HTMLElementWithInputs,
  IComponentInput, IReactiveStyleValue, OnCreate,
} from '@lirx/dom';
// @ts-ignore
import html from './mat-progress-ring.component.html?raw';
// @ts-ignore
import style from './mat-progress-ring.component.scss?inline';

/** COMPONENT **/

interface IData {
  readonly strokeWidth$: IObservable<number>;
  readonly strokeDashOffset$: IObservable<IReactiveStyleValue>;
  readonly strokeDashArray$: IObservable<string>;
  readonly radius$: IObservable<number>;
  readonly diameter$: IObservable<number>;
  readonly innerRadius$: IObservable<number>;
  readonly transform$: IObservable<string>;
}

type IComponentInputs = [
  IComponentInput<'progress', number>,
  IComponentInput<'radius', number>,
  IComponentInput<'stroke', number>,
];


// https://css-tricks.com/building-progress-ring-quickly/
// https://css-tricks.com/transforms-on-svg-elements/

@Component({
  name: 'mat-progress-ring',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatProgressRingComponent extends HTMLElementWithInputs<IComponentInputs>(['progress', 'radius', 'stroke']) implements OnCreate<IData> {
  protected readonly _data: IData;

  constructor() {
    super();

    /** SETUP PROPERTIES **/

    this.progress = 0;
    this.radius = 0;
    this.stroke = 0;

    const progress$ = this.progress$;
    const radius$ = this.radius$;
    const stroke$ = this.stroke$;

    /** SETUP SUBSCRIBE FUNCTIONS **/

    const strokeWidth$ = function$$(
      [stroke$, radius$],
      (stroke: number, radius: number): number => {
        return Math.min(stroke, radius);
      },
    );

    const innerRadius$ = function$$(
      [radius$, strokeWidth$],
      (radius: number, stroke: number): number => {
        return Math.max(0, radius - (stroke / 2));
      },
    );

    const circumference$ = map$$(innerRadius$, (radius: number): number => (radius * 2 * Math.PI));

    const strokeDashOffset$ = function$$(
      [circumference$, progress$],
      (circumference: number, progress: number): string => {
        return (circumference * (1 - progress)).toString(10);
      },
    );

    const strokeDashArray$ = map$$(circumference$, (circumference: number): string => `${circumference} ${circumference}`);

    const diameter$ = map$$(radius$, (radius: number): number => (radius * 2));

    const transform$ = map$$(radius$, (radius: number): string => `rotate(-90 ${radius} ${radius})`);

    this._data = {
      strokeWidth$,
      strokeDashOffset$,
      strokeDashArray$,
      radius$,
      diameter$,
      innerRadius$,
      transform$,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}
