import {
  bootstrap, compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, OnCreate
} from '@lifaon/rx-dom';
import {
  createMulticastReplayLastSource, IMulticastReplayLastSource, ISubscribeFunction, mapSubscribePipe,
  pipeSubscribeFunction
} from '@lifaon/rx-js-light';


/** COMPONENT **/

interface IData {
  input: IMulticastReplayLastSource<string>;
  remaining: ISubscribeFunction<number>;
  valid: ISubscribeFunction<boolean>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-hello-world',
  template: compileReactiveHTMLAsComponentTemplate(`
    <div class="input-container">
      <input
        #input
        [value]="$.input.subscribe"
        (input)="() => $.input.emit(input.value)"
      >
    </div>
    <div
      class="max-length-container"
      [class.valid]="$.valid"
    >
      Length: {{ $.remaining }} / 10
    </div>
  `, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
    }
    
    :host > .max-length-container:not(.valid) {
      color: red;
    }
  `),
})
class AppMainComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();
    const input = createMulticastReplayLastSource<string>({ initialValue: '' });

    const remaining = pipeSubscribeFunction(input.subscribe, [
      mapSubscribePipe((value: string) => value.length)
    ]);

    const valid = pipeSubscribeFunction(remaining, [
      mapSubscribePipe((value: number) => (value <= 10)),
    ]);

    this.data = {
      input,
      remaining,
      valid,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}

/** BOOTSTRAP FUNCTION **/

export function helloWorldExample() {
  bootstrap(new AppMainComponent());
}
