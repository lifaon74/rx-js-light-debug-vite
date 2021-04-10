import {
  bootstrap, compileAndEvaluateReactiveHTMLAsComponentTemplate, Component, DEFAULT_ARITHMETIC_CONSTANTS_TO_IMPORT,
  DEFAULT_CASTING_CONSTANTS_TO_IMPORT, DEFAULT_CONSTANTS_TO_IMPORT, OnCreate
} from '@lifaon/rx-dom';
import {
  createSubscribeFunctionProxy, idle, ISubscribeFunctionProxy, mapSubscribePipe, pipeSubscribeFunction,
  shareSubscribePipe
} from '@lifaon/rx-js-light';

/** GENERIC HELPERS **/

function createComponentProxy<GComponent extends HTMLElement>(
  component: GComponent,
): ISubscribeFunctionProxy<GComponent> {
  return createSubscribeFunctionProxy<GComponent>(pipeSubscribeFunction(idle(), [
    mapSubscribePipe<any, GComponent>(() => component),
    shareSubscribePipe<GComponent>(),
  ]));
}

interface IComponentData<GComponent extends HTMLElement> {
  readonly proxy: ISubscribeFunctionProxy<GComponent>;
  readonly self: GComponent;
}

/** COMPONENT **/

type IData = IComponentData<AppMainComponent>;

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_ARITHMETIC_CONSTANTS_TO_IMPORT,
  ...DEFAULT_CASTING_CONSTANTS_TO_IMPORT,
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-main',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <div>
      <input
        #input-a
        type="number"
        [value]="$.proxy.inputA.$"
        (input)="() => $.self.inputA = inputA.value"
      >
      <input
        #input-b
        type="number"
        [value]="$.proxy.inputB.$"
        (input)="() => $.self.inputB = inputB.value"
      >
    </div>
    <div>
      <span>{{ $.proxy.inputA.$ }}</span>
      +
      <span>{{ $.proxy.inputB.$ }}</span>
      =
      <span>{{ add(toNumber($.proxy.inputA.$), toNumber($.proxy.inputB.$)) }}</span>
    </div>
  `, CONSTANTS_TO_IMPORT),
})
class AppMainComponent extends HTMLElement implements OnCreate<IData> {
  inputA: string | number;
  inputB: string | number;

  protected readonly proxy: ISubscribeFunctionProxy<AppMainComponent>;

  constructor() {
    super();
    this.inputA = 1;
    this.inputB = 2;

    this.proxy = createComponentProxy<AppMainComponent>(this);
  }

  public onCreate(): IData {
    return {
      self: this,
      proxy: this.proxy,
    };
  }
}

/** BOOTSTRAP FUNCTION **/

export function autoUpdateExample() {
  bootstrap(new AppMainComponent());
}
