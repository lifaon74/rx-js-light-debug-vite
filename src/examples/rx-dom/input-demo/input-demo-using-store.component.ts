import { compileReactiveHTMLAsComponentTemplate, Component, OnCreate } from '@lifaon/rx-dom';
import { IObservable } from '@lifaon/rx-js-light';
import { createAction, createStore, mapState } from '@lifaon/rx-store';

/** STORE **/

/* INTERFACES */

interface IAppState {
  readonly value: string;
}

/* STORE */

const APP_STORE = createStore<IAppState>({
  value: '',
});

/* ACTIONS */

const setValue = createAction(APP_STORE, (state: IAppState, value: string): IAppState => {
  return {
    ...state,
    value,
  };
});


/* SELECTORS */

const value$ = mapState(APP_STORE, (state: IAppState) => state.value);

/** COMPONENT **/

interface IData {
  readonly setValue: typeof setValue;
  readonly value$: IObservable<string>;
}

@Component({
  name: 'app-input-demo-using-store',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <input
        [value]="$.value$"
        (input)="() => $.setValue(node.value)"
      >
      <div>
       {{ $.value$ }}
      </div>
   `,
  }),
})
export class AppInputDemoUsingStoreComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();
    this.data = {
      setValue,
      value$,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}
