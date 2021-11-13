import {
  bootstrap, compileAndEvaluateReactiveHTMLAsComponentTemplate, Component, DEFAULT_ARITHMETIC_CONSTANTS_TO_IMPORT,
  DEFAULT_CONSTANTS_TO_IMPORT, OnCreate, DEFAULT_CASTING_CONSTANTS_TO_IMPORT
} from '@lifaon/rx-dom';
import {
  createObservableProxy, idle, IObservableProxy, mapObservablePipe, pipeObservable,
  shareObservablePipe
} from '@lifaon/rx-js-light';

/** GENERIC HELPERS **/

function createComponentProxy<GComponent extends HTMLElement>(
  component: GComponent,
): IObservableProxy<GComponent> {
  return createObservableProxy<GComponent>(pipeObservable(idle(), [
    mapObservablePipe<any, GComponent>(() => component),
    shareObservablePipe<GComponent>(),
  ]));
}

interface IComponentData<GComponent extends HTMLElement> {
  readonly proxy: IObservableProxy<GComponent>;
  readonly self: GComponent;
}

function generateComponentData<GComponent extends HTMLElement>(
  instance: GComponent,
): IComponentData<GComponent> {
  return {
    self: instance,
    proxy: createComponentProxy<GComponent>(instance),
  };
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
        (input)="() => $.self.inputA = getNodeReference('input-a').value"
      >
      <input
        #input-b
        type="number"
        [value]="$.proxy.inputB.$"
        (input)="() => $.self.inputB = getNodeReference('input-b').value"
      >
    </div>
    <div>
      <span>{{ $.proxy.inputA.$ }}</span>
      +
      <span>{{ $.proxy.inputB.$ }}</span>
      =
      <span>{{ add(castToNumber($.proxy.inputA.$), castToNumber($.proxy.inputB.$)) }}</span>
    </div>
  `, CONSTANTS_TO_IMPORT),
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
    return generateComponentData(this);
  }
}

/** BOOTSTRAP FUNCTION **/

export function autoUpdateExample() {
  bootstrap(new AppMainComponent());
}
