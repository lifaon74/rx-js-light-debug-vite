import {
  attachNodeChildrenToNewDocumentFragment, compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate,
  Component, componentInputU$$, createDocumentFragment, createDocumentFragmentFilledWithNodes, IComponentInput,
  IDocumentFragmentOrNull, IHTMLTemplate, OnCreate, querySelector, querySelectorAll,
} from '@lirx/dom';
import { IObservable, map$$, single } from '@lirx/core';


export function selectComponentContentElements(
  content: DocumentFragment,
  selector: string,
): DocumentFragment {
  return createDocumentFragmentFilledWithNodes(querySelectorAll(content, selector));
}


export function selectComponentContentElementsAsObservable(
  content: DocumentFragment,
  selector: string,
): IObservable<DocumentFragment> {
  return single(selectComponentContentElements(content, selector));
}


export function selectComponentContentNodes(
  content: DocumentFragment,
  selector: string,
): DocumentFragment {
  const element: Element | null = querySelector(content, selector);
  if (element === null) {
    throw new Error(`Unable to locate: ${selector}`);
  } else {
    return attachNodeChildrenToNewDocumentFragment(element);
  }
}

export function selectComponentContentNodesAsObservable(
  content: DocumentFragment,
  selector: string,
): IObservable<DocumentFragment> {
  return single(selectComponentContentNodes(content, selector));
}

/** COMPONENT **/

type IHeaderTemplate = IHTMLTemplate<any>;

interface IData {
  readonly headerContent$: IObservable<IDocumentFragmentOrNull>; // IReactiveContent;
  readonly selectComponentContentElementsAsObservable: typeof selectComponentContentElementsAsObservable;
  readonly selectComponentContentNodesAsObservable: typeof selectComponentContentNodesAsObservable;
}

@Component({
  name: 'app-inject-content',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <div class="header">
        <rx-inject-content
          content="$.headerContent$"
        ></rx-inject-content>
      </div>
      <div class="body">
        <rx-inject-content
           content="$.selectComponentContentNodesAsObservable($content, '[body]')"
        ></rx-inject-content>
      </div>
      <div class="footer">
        <rx-inject-content
          content="$.selectComponentContentElementsAsObservable($content, '[footer]')"
        ></rx-inject-content>
      </div>
    `,
  }),
  styles: [compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
    }
  `)],
})
export class AppInjectContentComponent extends HTMLElement implements OnCreate<IData> {

  readonly headerTemplate: IComponentInput<IHeaderTemplate>;

  protected readonly _data: IData;

  constructor() {
    super();
    this.headerTemplate = componentInputU$$<IHeaderTemplate>();
    const headerTemplate$ = this.headerTemplate.value$;

    const headerContent$ = map$$(headerTemplate$, (header: IHeaderTemplate): IDocumentFragmentOrNull => header(createDocumentFragment()));

    this._data = {
      headerContent$,
      selectComponentContentElementsAsObservable,
      selectComponentContentNodesAsObservable,
    };
  }

  public onCreate(): IData {
    return this._data;
  }
}

