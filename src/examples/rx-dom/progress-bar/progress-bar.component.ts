import {
  composeEmitFunction, createMulticastReplayLastSource, distinctEmitPipe, IMulticastReplayLastSource,
  ISubscribeFunction, mapSubscribePipe, pipeSubscribeFunction, tapEmitPipe,
} from '@lifaon/rx-js-light';
import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, Input, OnCreate, syncAttributeWithNumberSource
} from '@lifaon/rx-dom';


// export interface IAttributeValueToPropertyValue<GValue> {
//   (value: IAttributeValue): GValue;
// }
//
// export interface IPropertyValueToAttributeValue<GValue> {
//   (value: GValue): IAttributeValue;
// }
//
// export interface IAttributeChange {
//   (value: IAttributeValue): void;
// }
//
// export function Attribute<GValue>(
//   name: string,
//   get: IAttributeValueToPropertyValue<GValue>,
//   set: IPropertyValueToAttributeValue<GValue>,
//   onChange: IAttributeChange,
// ): PropertyDecorator {
//   return (target: Object, propertyKey: string | symbol): void => {
//     const descriptor: PropertyDescriptor | undefined = Object.getOwnPropertyDescriptor(target, propertyKey);
//     Object.defineProperty(target, propertyKey, {
//       get: function (): GValue {
//         return get(getAttributeValue(this, name));
//       },
//       ...descriptor,
//       set: function (value: GValue): void {
//         if (descriptor?.set) {
//           descriptor.set(value);
//         }
//         setAttributeValueWithEvent(this, name, set(value));
//       }
//     });
//   };
// }

/*--------------------*/

/** COMPONENT **/

interface IData {
  percent: ISubscribeFunction<string>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-progress-bar',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <div
      class="progress"
      [style.width]="$.percent"
    >{{ $.percent }}</div>
  `, CONSTANTS_TO_IMPORT),
  styles: [compileReactiveCSSAsComponentStyle(`
    :host {
      --app-progress-bar-color: #87c5fa;

      display: block;
      width: 100%;
      height: 20px;
      border: 1px solid #ccc;
      border-radius: 4px;
      overflow: hidden;
      text-align: center;
      font-size: 14px;
      font-family: Arial, sans-serif;
      color: white;
    }
    
    :host > .progress {
      height: 100%;
      background-color: var(--app-progress-bar-color, #87c5fa);
      transition: width 500ms;
    }
  `)],
})
export class AppProgressBarComponent extends HTMLElement implements OnCreate<IData> {

  @Input((instance: AppProgressBarComponent) => instance._progress)
  progress!: number;

  protected readonly data: IData;
  protected readonly _progress: IMulticastReplayLastSource<number>;

  constructor() {
    super();
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

    this.data = {
      percent: pipeSubscribeFunction(progress.subscribe, [
        mapSubscribePipe((progress: number) => `${ Math.round(progress * 100) }%`)
      ]),
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}
