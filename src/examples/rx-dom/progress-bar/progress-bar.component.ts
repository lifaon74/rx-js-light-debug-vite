import {
  createMulticastReplayLastSource, IEmitFunction, IMulticastReplayLastSource, ISource, ISubscribeFunction, mapEmitPipe,
  mapSubscribePipe, mapToStringSubscribePipe, pipeSubscribeFunction, SubscriptionManager
} from '@lifaon/rx-js-light';
import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, getAttributeValue, IAttributeValue, IReactiveAttributeValue, onAttributeChangeListener,
  OnConnect, OnCreate, OnDisconnect, reactiveAttribute, setAttributeValueWithEvent, setReactiveAttribute,
  subscribeOnNodeConnectedTo
} from '@lifaon/rx-dom';

/*------------*/

export interface IInputDecoratorGetSource<GValue> {
  (instance: any): IMulticastReplayLastSource<GValue>;
}

export interface IInputDecoratorOptions {

}

export function Input<GValue>(
  getSource: IInputDecoratorGetSource<GValue>,
  options: IInputDecoratorOptions = {},
): PropertyDecorator {
  return (target: Object, propertyKey: string | symbol): void => {
    Object.defineProperty(target, propertyKey, {
      configurable: true,
      enumerable: false,
      get: function (): GValue {
        return getSource(this).getValue();
      },
      set: function (value: GValue): void {
        getSource(this).emit(value);
      },
    });
  };
}

/*------------*/


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
  style: compileReactiveCSSAsComponentStyle(`
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
  `),
})
export class AppProgressBarComponent extends HTMLElement implements OnCreate<IData>, OnConnect, OnDisconnect {

  @Input((instance: AppProgressBarComponent) => instance._ratio)
  ratio!: number;

  protected readonly data: IData;
  protected readonly _ratio: IMulticastReplayLastSource<number>;
  protected readonly subscriptions: SubscriptionManager;

  constructor() {
    super();
    const ratio = createMulticastReplayLastSource<number>({ initialValue: 0 });
    this._ratio = {
      ...ratio,
      emit: (value: number) => {
        if ((0 <= value) && (value <= 1)) {
          if (value !== ratio.getValue()) {
            ratio.emit(value);
          }
        } else {
          throw new RangeError(`ratio must be in the range [0, 1]`);
        }
      },
    };

    this.subscriptions = new SubscriptionManager();

    this.data = {
      percent: pipeSubscribeFunction(this._ratio.subscribe, [
        mapSubscribePipe((ratio: number) => `${ Math.round(ratio * 100) }%`)
      ]),
    };

    // reactiveAttribute(
    //   {
    //     subscribe: pipeSubscribeFunction(this._ratio.subscribe, [
    //       mapToStringSubscribePipe(),
    //     ]),
    //     emit: mapEmitPipe((value: IAttributeValue) => ((value === null) ? 0 : Number(value)))(this._ratio.emit),
    //   },
    //   this,
    //   'ratio',
    // );
  }

  // get ratio(): number {
  //   return this._ratio.getValue();
  // }
  //
  // set ratio(value: number) {
  //   this._ratio.emit(value);
  // }

  public onCreate(): IData {
    return this.data;
  }

  public onConnect(): void {
    this.subscriptions.activateAll();
  }

  public onDisconnect(): void {
    this.subscriptions.deactivateAll();
  }
}
