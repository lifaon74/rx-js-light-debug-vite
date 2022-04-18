import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, customElementRef, OnCreate,
} from '@lirx/dom';
import { IObservable, IObserver, let$$ } from '@lirx/core';


/** COMPONENT **/

interface IItem {
  readonly name: string;
  readonly children: IItem[];
}

interface IData {
  readonly items$: IObservable<IItem[]>;
}


@Component({
  name: 'app-file-tree',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <div
        class="item"
        *for="let item of $.items$"
      >
        <div class="name">
          {{ item.name }}
        </div>
        <app-file-tree
          class="children"
          [items]="item.children"
        ></app-file-tree>
      </div>
    `,
    customElements: [
      customElementRef('app-file-tree', () => AppFileTreeComponent),
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
    }

    :host > .item {
      margin: 2px 0;
    }
    
    :host > .item > .name {
      border-left: 3px solid #ccc;
      padding: 0 6px;
      font-size: 14px;
    }
    
    :host > .item > .children {
      padding-left: 10px;
    }
  `)],
})
export class AppFileTreeComponent extends HTMLElement implements OnCreate<IData> {
  readonly $items: IObserver<IItem[]>;

  protected readonly data: IData;

  constructor() {
    super();

    const $items$ = let$$<IItem[]>([]);
    this.$items = $items$.emit;
    const items$ = $items$.subscribe;

    this.data = {
      items$,
    };
  }

  set items(
    value: IItem[],
  ) {
    this.$items(value);
  }

  public onCreate(): IData {
    return this.data;
  }
}
