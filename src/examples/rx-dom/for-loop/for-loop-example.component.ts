import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, OnCreate
} from '@lifaon/rx-dom';
import { IMulticastReplayLastSource, ISubscribeFunction } from '@lifaon/rx-js-light';
import { single$$, let$$, map$$ } from '@lifaon/rx-js-light-shortcuts';


/** COMPONENT **/

interface IItem {
  readonly text$: ISubscribeFunction<string>;
  readonly $selected$: IMulticastReplayLastSource<boolean>;
}

interface IData {
  readonly count$: ISubscribeFunction<number>;
  readonly time$: ISubscribeFunction<number>;
  readonly items$: ISubscribeFunction<IItem[]>;

  readonly onClickItem: (item: IItem) => void;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-for-loop-example',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <div class="count">
      count: {{ $.count$ }} in {{ $.time$ }}ms
    </div>
    <div
      class="item"
      *for="let item of $.items$"
      (click)="() => $.onClickItem(item)"
      [class.selected]="item.$selected$.subscribe"
    >
      {{ item.text$ }}
    </div>
  `, CONSTANTS_TO_IMPORT),
  styles: [compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
      padding: 20px;
    }

    :host > .count {
      font-size: 14px;
    }
    
    :host > .item {
      border: 1px solid #ccc;
      padding: 10px;
      font-size: 14px;
      border-radius: 5px;
      margin: 5px 0;
    }
    
    :host > .item.selected {
      background-color: #ddd;
    }
  `)],
})
export class AppForLoopExampleComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();
    const $time$ = let$$<number>(0);
    const time$ =  $time$.subscribe;

    const $items$ = let$$<IItem[]>([]);
    const items$ = $items$.subscribe;

    const count$ = map$$($items$.subscribe, (items: IItem[]) => items.length);

    const items = Array.from({ length: 1e4 }, (v: any, index: number): IItem => ({
      text$: single$$(`#${ index }`),
      $selected$: let$$<boolean>(false),
    }));

    const onClickItem = (item: IItem): void => {
      console.time('select-item');
      item.$selected$.emit(!item.$selected$.getValue());
      console.timeEnd('select-item');
    };


    let count: number = 1;

    const updateItems = (items: IItem[]) => {
      const start: number = Date.now();
      $items$.emit(items);
      const end: number = Date.now();

      $time$.emit(end - start);
    };

    const loop = () => {
      count = Math.max(1, count * 10);
      count = (count > items.length) ? 1 : count;

      updateItems(items.slice(0, count));

      setTimeout(loop, 2000);
    };

    // const loop = () => {
    //   updateItems(shuffleArray(items.slice()));
    //   setTimeout(loop, 2000);
    // };

    loop();

    // setTimeout(() => {
    //   updateItems(items);
    //   setTimeout(() => {
    //     updateItems([]);
    //   }, 500);
    // }, 500);

    // updateItems(items);

    // (window as any).items = items;
    // (window as any).$items$ = $items$;
    // (window as any).updateItems = updateItems;

    this.data = {
      count$,
      time$,
      items$,

      onClickItem,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}
