import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, OnCreate
} from '@lifaon/rx-dom';
import { ISubscribeFunction } from '@lifaon/rx-js-light';
import { const$$, let$$, map$$ } from '@lifaon/rx-js-light-shortcuts';

function shuffleArray<GArray extends any[]>(array: GArray): GArray {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

/** COMPONENT **/

interface IItem {
  text: ISubscribeFunction<string>;
}

interface IData {
  count: ISubscribeFunction<number>;
  time: ISubscribeFunction<number>;
  items: ISubscribeFunction<IItem[]>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-hello-world',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <div class="count">
      count: {{ $.count }} in {{ $.time }}ms
    </div>
    <div
      class="item"
      *for="let item of $.items; index as index"
    >
      {{ item.text }}
    </div>
  `, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
      padding: 20px;
    }

    :host > .item {
      border: 1px solid #ccc;
      padding: 10px;
      font-size: 14px;
      border-radius: 5px;
      margin: 5px 0;
    }
  `),
})
export class AppForLoopExampleComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();
    const $time$ = let$$<number>(0);
    const $items$ = let$$<IItem[]>([]);

    const items = Array.from({ length: 1e4 }, (v: any, index: number) => ({
      text: const$$(`#${ index }`),
    }));


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

    this.data = {
      count: map$$($items$.subscribe, (items: IItem[]) => items.length),
      time: $time$.subscribe,
      items: $items$.subscribe,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}
