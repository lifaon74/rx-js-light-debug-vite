import {
  composeEmitFunction, createMulticastReplayLastSource, distinctEmitPipe, IMulticastReplayLastSource,
  ISubscribeFunction, mapSubscribePipe, pipeSubscribeFunction, reactiveFunction, tapEmitPipe
} from '@lifaon/rx-js-light';
import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, Input, OnCreate, syncAttributeWithNumberSource
} from '@lifaon/rx-dom';


/** COMPONENT **/

interface IData {
  strokeWidth: ISubscribeFunction<number>;
  strokeDashOffset: ISubscribeFunction<number>;
  strokeDashArray: ISubscribeFunction<string>;
  radius: ISubscribeFunction<number>;
  diameter: ISubscribeFunction<number>;
  innerRadius: ISubscribeFunction<number>;
  transform: ISubscribeFunction<string>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

// https://css-tricks.com/building-progress-ring-quickly/
// https://css-tricks.com/transforms-on-svg-elements/

@Component({
  name: 'app-progress-ring',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
     <svg
      [attr.width]="$.diameter"
      [attr.height]="$.diameter"
     >
       <circle
         stroke="red"
         fill="transparent"
         [attr.r]="$.innerRadius"
         [attr.cx]="$.radius"
         [attr.cy]="$.radius"
         [attr.stroke-width]="$.strokeWidth"
         [attr.stroke-dasharray]="$.strokeDashArray"
         [style.stroke-dashoffset]="$.strokeDashOffset"
         [attr.transform]="$.transform"
      />
    </svg>
  `, CONSTANTS_TO_IMPORT),
  // template: (variables: ICompiledComponentTemplateFunctionVariables<IData>) => template(variables, CONSTANTS_TO_IMPORT),
  styles: [compileReactiveCSSAsComponentStyle(`
    :host {
      display: inline-block;
    }
    
    :host > svg > circle {
      stroke: var(--app-progress-ring-color, #87c5fa);
      transition: stroke-dashoffset var(--app-progress-ring-transition-duration, 250ms);
    }
  `)],
})
export class AppProgressRingComponent extends HTMLElement implements OnCreate<IData> {

  @Input((instance: AppProgressRingComponent) => instance._progress)
  progress!: number;

  @Input((instance: AppProgressRingComponent) => instance._radius)
  radius!: number;

  @Input((instance: AppProgressRingComponent) => instance._stroke)
  stroke!: number;

  protected readonly _data: IData;
  protected readonly _progress: IMulticastReplayLastSource<number>;
  protected readonly _radius: IMulticastReplayLastSource<number>;
  protected readonly _stroke: IMulticastReplayLastSource<number>;

  constructor() {
    super();

    /** SETUP PROPERTIES **/

    const progress = createMulticastReplayLastSource<number>();
    this._progress = {
      ...progress,
      emit: composeEmitFunction([
        tapEmitPipe<number>((value: number) => {
          if ((value < 0) || (value > 1)) {
            throw new RangeError(`progress must be in the range [0, 1]`);
          }
        }),
        distinctEmitPipe<number>(),
      ], progress.emit),
    };
    syncAttributeWithNumberSource(this._progress, this, 'progress', 0);

    const radius = createMulticastReplayLastSource<number>();
    this._radius = {
      ...radius,
      emit: composeEmitFunction([
        tapEmitPipe<number>((value: number) => {
          if (value < 0) {
            throw new RangeError(`radius must be in the range [0, Infinity[`);
          }
        }),
        distinctEmitPipe<number>(),
      ], radius.emit),
    };
    syncAttributeWithNumberSource(this._radius, this, 'radius', 50);

    const stroke = createMulticastReplayLastSource<number>();
    this._stroke = {
      ...stroke,
      emit: composeEmitFunction([
        tapEmitPipe<number>((value: number) => {
          if (value < 0) {
            throw new RangeError(`stroke must be in the range [0, Infinity[`);
          }
        }),
        distinctEmitPipe<number>(),
      ], stroke.emit),
    };
    syncAttributeWithNumberSource(this._stroke, this, 'stroke', 5);


    /** SETUP SUBSCRIBE FUNCTIONS **/

    const strokeWidth: ISubscribeFunction<number> = reactiveFunction(
      [stroke.subscribe, radius.subscribe],
      (stroke: number, radius: number): number => {
        return Math.min(stroke, radius);
      },
    );

    const innerRadius: ISubscribeFunction<number> = reactiveFunction(
      [radius.subscribe, strokeWidth],
      (radius: number, stroke: number): number => {
        return Math.max(0, radius - (stroke / 2));
      },
    );

    const circumference: ISubscribeFunction<number> = pipeSubscribeFunction(innerRadius, [
      mapSubscribePipe<number, number>((radius: number): number => (radius * 2 * Math.PI)),
    ]);

    const strokeDashOffset: ISubscribeFunction<number> = reactiveFunction(
      [circumference, progress.subscribe],
      (circumference: number, progress: number): number => {
        return circumference * (1 - progress);
      },
    );

    const strokeDashArray: ISubscribeFunction<string> = pipeSubscribeFunction(circumference, [
      mapSubscribePipe<number, string>((circumference: number): string => `${ circumference } ${ circumference }`),
    ]);

    const diameter: ISubscribeFunction<number> = pipeSubscribeFunction(radius.subscribe, [
      mapSubscribePipe<number, number>((radius: number): number => (radius * 2)),
    ]);

    const transform: ISubscribeFunction<string> = pipeSubscribeFunction(radius.subscribe, [
      mapSubscribePipe<number, string>((radius: number): string => `rotate(-90 ${ radius } ${ radius })`),
    ]);

    this._data = {
      strokeWidth,
      strokeDashOffset,
      strokeDashArray,
      radius: radius.subscribe,
      diameter,
      innerRadius,
      transform,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}
