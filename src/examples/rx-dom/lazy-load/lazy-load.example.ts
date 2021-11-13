import {
  bootstrap, compileAndEvaluateReactiveHTMLAsComponentTemplate, Component, createDocumentFragment,
  DEFAULT_CONSTANTS_TO_IMPORT,
  HTMLElementConstructor, Input, nodeAppendChild, OnCreate
} from '@lifaon/rx-dom';
import { IMulticastReplayLastSource, IObservable, letU$$, map$$$, mergeAll$$$, of, pipe$$ } from '@lifaon/rx-js-light';

/** COMPONENT **/

interface IData {
  content$: IObservable<DocumentFragment>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-lazy-component',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <rx-inject-content
      content="$.content$"
    ></rx-inject-content>
  `, CONSTANTS_TO_IMPORT),
})
export class AppLazyComponent extends HTMLElement implements OnCreate<IData> {
  @Input((instance: AppLazyComponent) => instance._$component$)
  component$!: IObservable<HTMLElementConstructor>;

  protected readonly _data: IData;

  protected readonly _$component$: IMulticastReplayLastSource<IObservable<HTMLElementConstructor>>;

  constructor() {
    super();
    const $component$ = letU$$<IObservable<HTMLElementConstructor>>();
    this._$component$ = $component$;

    const content$ = pipe$$($component$.subscribe, [
      mergeAll$$$<HTMLElementConstructor>(1),
      map$$$<HTMLElementConstructor, DocumentFragment>((component: HTMLElementConstructor) => {
        const fragment: DocumentFragment = createDocumentFragment();
        nodeAppendChild(fragment, new component());
        return fragment;
      })
    ]);

    this._data = {
      content$,
    };
  }

  onCreate(): IData {
    return this._data;
  }
}


/*---------*/

export async function lazyLoadExample() {
  const lazy = new AppLazyComponent();

  bootstrap(lazy);

  const load = async () => {
    const { MatProgressBarComponent } = await import('../material/progress/progress-bar/mat-progress-bar.component');
    lazy.component$ = of(MatProgressBarComponent);
  };

  await load();

}
