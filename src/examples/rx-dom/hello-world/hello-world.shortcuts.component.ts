import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate
} from '@lifaon/rx-dom';
import { IMulticastReplayLastSource, ISubscribeFunction } from '@lifaon/rx-js-light';
import { let$$, map$$ } from '@lifaon/rx-js-light-shortcuts';

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

    const $input$ = let$$('');
    const remaining$ = map$$($input$.subscribe, (value: string) => value.length);
    const valid$ = map$$(remaining$, (value: number) => (value <= 10));

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
