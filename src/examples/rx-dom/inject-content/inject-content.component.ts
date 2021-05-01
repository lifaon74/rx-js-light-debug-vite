import {
  attachNodeChildrenToNewDocumentFragment, compileAndEvaluateReactiveHTMLAsComponentTemplate,
  compileReactiveCSSAsComponentStyle, Component, createDocumentFragmentFilledWithNodes, DEFAULT_CONSTANTS_TO_IMPORT,
  IHTMLTemplate, Input, OnCreate, querySelector, querySelectorAll
} from '@lifaon/rx-dom';
import { IMulticastReplayLastSource, ISubscribeFunction, of } from '@lifaon/rx-js-light';
import { letU$$, map$$$, mergeAll$$$, pipe$$ } from '@lifaon/rx-js-light-shortcuts';

export function selectComponentContentElements(
  content: DocumentFragment,
  selector: string,
): DocumentFragment {
  return createDocumentFragmentFilledWithNodes(querySelectorAll(content, selector));
}

export function selectComponentContentNodes(
  content: DocumentFragment,
  selector: string,
): DocumentFragment {
  const element: Element | null = querySelector(content, selector);
  if (element === null) {
    throw new Error(`Unable to locate: ${ selector }`);
  } else {
    return attachNodeChildrenToNewDocumentFragment(element);
  }
}

/** COMPONENT **/

type IHeaderTemplate = IHTMLTemplate<any>;

interface IData {
  // header$: ISubscribeFunction<IHeaderTemplate>;
  header$: ISubscribeFunction<DocumentFragment>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  selectComponentContentElements,
  selectComponentContentNodes,
  of,
};


@Component({
  name: 'app-inject-content',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <div class="header">
      <rx-inject-content
        content="$.header$"
      ></rx-inject-content>
    </div>
    <div class="body">
      <rx-inject-content
         content="of(selectComponentContentNodes($content, '[body]'))"
      ></rx-inject-content>
    </div>
    <div class="footer">
      <rx-inject-content
        content="of(selectComponentContentElements($content, '[footer]'))"
      ></rx-inject-content>
    </div>
  `, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
    }
  `),
})
export class AppInjectContentComponent extends HTMLElement implements OnCreate<IData> {

  @Input((instance: AppInjectContentComponent) => instance._$header$)
  header$!: ISubscribeFunction<IHeaderTemplate>;

  protected readonly _data: IData;
  protected readonly _$header$: IMulticastReplayLastSource<ISubscribeFunction<IHeaderTemplate>>;

  constructor() {
    super();
    const $header$ = letU$$<ISubscribeFunction<IHeaderTemplate>>();
    this._$header$ = $header$;

    const header$ = pipe$$($header$.subscribe, [
      mergeAll$$$<IHeaderTemplate>(1),
      map$$$<IHeaderTemplate, DocumentFragment>((header: IHeaderTemplate) => header({})),
    ]);

    // header$((result) => {
    //   console.log('header$', result);
    // });

    this._data = {
      header$,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}

