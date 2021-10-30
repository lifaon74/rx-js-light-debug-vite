import { IEmitFunction, ISubscribeFunction, single } from '@lifaon/rx-js-light';
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, IDynamicStyleValue, OnCreate,
  setComponentSubscribeFunctionProperties, setReactiveStyle
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-progress-ring.component.html?raw';
// @ts-ignore
import style from './mat-progress-ring.component.scss?inline';
import { function$$, let$$, map$$ } from '@lifaon/rx-js-light-shortcuts';

/** COMPONENT **/

interface IData {
  readonly strokeWidth$: ISubscribeFunction<number>;
  readonly strokeDashOffset$: ISubscribeFunction<IDynamicStyleValue>;
  readonly strokeDashArray$: ISubscribeFunction<string>;
  readonly radius$: ISubscribeFunction<number>;
  readonly diameter$: ISubscribeFunction<number>;
  readonly innerRadius$: ISubscribeFunction<number>;
  readonly transform$: ISubscribeFunction<string>;
}

// https://css-tricks.com/building-progress-ring-quickly/
// https://css-tricks.com/transforms-on-svg-elements/

@Component({
  name: 'mat-progress-ring',
  template: compileReactiveHTMLAsGenericComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppProgressRingComponent extends HTMLElement implements OnCreate<IData> {

  progress$!: ISubscribeFunction<number>;
  readonly $progress!: IEmitFunction<number>;
  progress!: number;

  radius$!: ISubscribeFunction<number>;
  readonly $radius!: IEmitFunction<number>;
  radius!: number;

  stroke$!: ISubscribeFunction<number>;
  readonly $stroke!: IEmitFunction<number>;
  stroke!: number;

  protected readonly _data: IData;

  constructor() {
    super();

    /** SETUP PROPERTIES **/

    const $progress$ = let$$<ISubscribeFunction<number>>(single(0));
    setComponentSubscribeFunctionProperties(this, 'progress', $progress$);
    const progress$ = this.progress$;

    const $radius$ = let$$<ISubscribeFunction<number>>(single(50));
    setComponentSubscribeFunctionProperties(this, 'radius', $radius$);
    const radius$ = this.radius$;

    const $stroke$ = let$$<ISubscribeFunction<number>>(single(5));
    setComponentSubscribeFunctionProperties(this, 'stroke', $stroke$);
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

    const strokeDashArray$ = map$$(circumference$, (circumference: number): string => `${ circumference } ${ circumference }`);

    const diameter$ = map$$(radius$, (radius: number): number => (radius * 2));

    const transform$ = map$$(radius$, (radius: number): string => `rotate(-90 ${ radius } ${ radius })`);

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
