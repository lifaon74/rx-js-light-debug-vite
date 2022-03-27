import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
} from '@lifaon/rx-dom';
import { IMulticastReplayLastSource, IObservable, let$$ } from '@lifaon/rx-js-light';
import { createAction, createStore, getStoreState, immutableArrayReplace, mapState } from '@lifaon/rx-store';


/** STORE **/

/* INTERFACES */

interface IAppState {
  readonly items: readonly IItem[];
}

interface IItem {
  readonly id: string;
  readonly text: string;
  readonly selected: boolean;
}


/* STORE */

const APP_STORE = createStore<IAppState>({
  items: [],
});

/* ACTIONS */

const setItems = createAction(APP_STORE, (state: IAppState, items: IItem[]): IAppState => {
  return {
    ...state,
    items,
  };
});

const appendItems = createAction(APP_STORE, (state: IAppState, items: IItem[]): IAppState => {
  return {
    ...state,
    items: [
      ...state.items,
      ...items,
    ],
  };
});

function appendItemsByChunk(
  items: readonly IItem[],
  size: number,
  index: number = 0,
): Promise<void> {
  return new Promise<void>((
    resolve: (value: void | PromiseLike<void>) => void,
  ): void => {
    const end: number = Math.min(items.length, index + size);
    if (index < end) {
      appendItems(items.slice(index, end));
      setTimeout(() => resolve(appendItemsByChunk(items, size, index + size)), 0);
    } else {
      resolve();
    }
  });

}

const selectItem = createAction(APP_STORE, (state: IAppState, id: string, selected: boolean = true): IAppState => {
  const index: number = state.items.findIndex(item => item.id === id);
  if (index === -1) {
    throw new Error(`Invalid item id`);
  } else {
    // state.items[index] = {
    //   ...state.items[index],
    //   selected,
    // };
    // return state;
    return {
      ...state,
      items: immutableArrayReplace(state.items, index, {
        ...state.items[index],
        selected,
      }),
    };
  }
});

/* HELPERS */


function trackItemById(
  item: IItem,
): string {
  return item.id;
}

// ; trackBy: trackItemById

/** COMPONENT **/


interface IData {
  readonly $inputValue$: IMulticastReplayLastSource<string>;
  readonly items$: IObservable<readonly IItem[]>;
  readonly onClickAppendItems: () => void;
  readonly onClickItem: (item: IItem) => void;
}


@Component({
  name: 'app-for-loop-example',
  template: compileReactiveHTMLAsComponentTemplate({
    html: `
      <button (click)="$.onClickAppendItems">
        Append items
      </button>
      <input
        [value]="$.$inputValue$.subscribe"
        (input)="() => $.$inputValue$.emit(node.value)"
      >
      <div
        class="item"
        *for="let item of $.items$"
        (click)="() => $.onClickItem(item)"
        [class.selected]="item.selected"
      >
        {{ of(item.text) }}
      </div>
    `,
  }),
  styles: [compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
      padding: 20px;
    }
    
    :host > button, :host > input {
      height: 30px;
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
export class AppForLoopExampleUsingStoreComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();

    const $inputValue$ = let$$('1e3');

    const generateItems = (): IItem[] => {
      const offset: number = getStoreState(APP_STORE).items.length;
      return Array.from({ length: Number($inputValue$.getValue()) }, (v: any, index: number): IItem => {
        const id: string = String(offset + index);
        return {
          id,
          text: `#${id}`,
          selected: false,
        };
      });
    };

    // const onClickAppendItems = () => {
    //   console.time('append-items');
    //   appendItems(generateItems());
    //   console.timeEnd('append-items');
    // };

    const onClickAppendItems = () => {
      console.time('append-items');
      appendItemsByChunk(generateItems(), 1e2)
        .then(() => {
          console.timeEnd('append-items');
        });
    };

    const onClickItem = (item: IItem): void => {
      console.time('select-item');
      selectItem(item.id, !item.selected);
      console.timeEnd('select-item');
    };

    this.data = {
      $inputValue$,
      items$: mapState(APP_STORE, (state: IAppState) => state.items),

      onClickAppendItems,
      onClickItem,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}
