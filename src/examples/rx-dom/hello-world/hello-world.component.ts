import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate
} from '@lifaon/rx-dom';
import {
  createMulticastReplayLastSource, IMulticastReplayLastSource, ISubscribeFunction, mapSubscribePipe,
  pipeSubscribeFunction
} from '@lifaon/rx-js-light';

/** COMPONENT **/

interface IData {
  readonly $input$: IMulticastReplayLastSource<string>;
  readonly remaining$: ISubscribeFunction<number>;
  readonly valid$: ISubscribeFunction<boolean>;
}

@Component({
  name: 'app-hello-world',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html: `
      <div class="input-container">
        <input
          #input
          [value]="$.$input$.subscribe"
          (input)="() => $.$input$.emit(getNodeReference('input').value)"
        >
      </div>
      <div
        class="max-length-container"
        [class.valid]="$.valid$"
      >
        Length: {{ $.remaining$ }} / 10
      </div>
   `,
  }),
  styles: [compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
    }

    :host > .max-length-container:not(.valid) {
      color: red;
    }
  `)],
})
export class AppHelloWorldComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();
    const $input$ = createMulticastReplayLastSource<string>({ initialValue: '' });

    const remaining$ = pipeSubscribeFunction($input$.subscribe, [
      mapSubscribePipe((value: string) => value.length)
    ]);

    const valid$ = pipeSubscribeFunction(remaining$, [
      mapSubscribePipe((value: number) => (value <= 10)),
    ]);


    this.data = {
      $input$,
      remaining$,
      valid$,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}
