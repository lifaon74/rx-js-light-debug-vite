import {
  bootstrap, compileReactiveHTMLAsComponentTemplate, Component, generateComponentProxyData, IComponentProxyData,
  OnCreate,
} from '@lifaon/rx-dom';
import { add$$, IObservable, mapObservable } from '@lifaon/rx-js-light';


function castToNumber(
  subscribe: IObservable<any>,
): IObservable<number> {
  return mapObservable(subscribe, Number);
}

/** COMPONENT **/

interface IData extends IComponentProxyData<AppMainComponent> {
  readonly add$$: typeof add$$;
  readonly castToNumber: typeof castToNumber;
}

@Component({
  name: 'app-main',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <div>
        <input
          type="number"
          [value]="$.proxy.inputA.$"
          (input)="() => $.self.inputA = node.value"
        >
        <input
          type="number"
          [value]="$.proxy.inputB.$"
          (input)="() => $.self.inputB = node.value"
        >
      </div>
      <div>
        <span>{{ $.proxy.inputA.$ }}</span>
        +
        <span>{{ $.proxy.inputB.$ }}</span>
        =
        <span>{{ $.add$$($.castToNumber($.proxy.inputA.$), $.castToNumber($.proxy.inputB.$)) }}</span>
      </div>
    `,
  }),
})
class AppMainComponent extends HTMLElement implements OnCreate<IData> {
  inputA: string | number;
  inputB: string | number;

  constructor() {
    super();
    this.inputA = 1;
    this.inputB = 2;
  }

  public onCreate(): IData {
    return {
      ...generateComponentProxyData<AppMainComponent>(this),
      add$$,
      castToNumber,
    };
  }
}

/** BOOTSTRAP FUNCTION **/

export function autoUpdateExample() {
  bootstrap(new AppMainComponent());
}
