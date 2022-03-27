import { compileReactiveHTMLAsComponentTemplate, Component, OnCreate } from '@lifaon/rx-dom';
import { IObservable, IObserver, let$$ } from '@lifaon/rx-js-light';

/** COMPONENT **/

interface IData {
  readonly $value: IObserver<string>;
  readonly value$: IObservable<string>;
}

@Component({
  name: 'app-input-demo',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <input
        [value]="$.value$"
        (input)="() => $.$value(node.value)"
      >
      <div>
       {{ $.value$ }}
      </div>
   `,
  }),
})
export class AppInputDemoComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();
    const { emit: $value, subscribe: value$ } = let$$<string>('');

    this.data = {
      $value,
      value$,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}
