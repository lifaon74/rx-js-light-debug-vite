import { function$$, IObservable, IObserver, let$$, map$$, single } from '@lifaon/rx-js-light';
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, defineObservableProperty,
  IReactiveStyleValue, OnCreate,
} from '@lifaon/rx-dom';
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

// https://css-tricks.com/building-progress-ring-quickly/
// https://css-tricks.com/transforms-on-svg-elements/

@Component({
  name: 'mat-progress-ring',
  template: compileReactiveHTMLAsComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatProgressRingComponent extends HTMLElement implements OnCreate<IData> {

  progress$!: IObservable<number>;
  readonly $progress!: IObserver<number>;
  progress!: number;

  radius$!: IObservable<number>;
  readonly $radius!: IObserver<number>;
  radius!: number;

  stroke$!: IObservable<number>;
  readonly $stroke!: IObserver<number>;
  stroke!: number;

  protected readonly _data: IData;

  constructor() {
    super();

    /** SETUP PROPERTIES **/

    const $progress$ = let$$<IObservable<number>>(single(0));
    defineObservableProperty(this, 'progress', $progress$);
    const progress$ = this.progress$;

    const $radius$ = let$$<IObservable<number>>(single(50));
    defineObservableProperty(this, 'radius', $radius$);
    const radius$ = this.radius$;

    const $stroke$ = let$$<IObservable<number>>(single(5));
    defineObservableProperty(this, 'stroke', $stroke$);
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
