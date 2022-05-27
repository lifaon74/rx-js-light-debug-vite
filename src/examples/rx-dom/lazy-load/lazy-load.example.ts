import {
  bootstrap, compileReactiveHTMLAsComponentTemplate, Component, createDocumentFragment, HTMLElementConstructor, Input,
  nodeAppendChild, OnCreate,
} from '@lirx/dom';
import { IMulticastReplayLastSource, IObservable, let$$, map$$$, mergeAll$$$, of, pipe$$ } from '@lirx/core';

/** COMPONENT **/

interface IData {
  content$: IObservable<DocumentFragment>;
}

@Component({
  name: 'app-lazy-component',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <rx-inject-content
        content="$.content$"
      ></rx-inject-content>
    `,
  }),
})
export class AppLazyComponent extends HTMLElement implements OnCreate<IData> {
  @Input((instance: AppLazyComponent) => instance._$component$)
  component$!: IObservable<HTMLElementConstructor>;

  protected readonly _data: IData;

  protected readonly _$component$: IMulticastReplayLastSource<IObservable<HTMLElementConstructor>>;

  constructor() {
    super();
    const $component$ = let$$<IObservable<HTMLElementConstructor>>();
    this._$component$ = $component$;

    const content$ = pipe$$($component$.subscribe, [
      mergeAll$$$<HTMLElementConstructor>(1),
      map$$$<HTMLElementConstructor, DocumentFragment>((component: HTMLElementConstructor) => {
        const fragment: DocumentFragment = createDocumentFragment();
        nodeAppendChild(fragment, new component());
        return fragment;
      }),
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
    const { MatProgressBarComponent } = await import('../material/components/progress/progress-bar/mat-progress-bar.component');
    lazy.component$ = of(MatProgressBarComponent);
  };

  await load();

}
