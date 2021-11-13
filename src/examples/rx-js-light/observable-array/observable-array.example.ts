import {
  createMulticastSource, fromEventTarget, IMulticastReplayLastSource, IMulticastSource, IObservable, Subscription
} from '@lifaon/rx-js-light';


export class ObservableArray<GItem> {
  public readonly subscribe: IObservable<readonly GItem[]>;

  protected _$items$: IMulticastSource<readonly GItem[]>;
  protected _items: GItem[];

  constructor(
    items?: Iterable<GItem>,
  ) {
    this._$items$ = createMulticastSource<readonly GItem[]>();
    this._items = items
      ? Array.from(items)
      : [];

    this.subscribe = this._$items$.subscribe;
  }

  get items(): readonly GItem[] {
    return this._items;
  }

  length(): number {
    return this._items.length;
  }

  get(
    index: number,
  ): GItem {
    return this._items[index];
  }

  set(
    index: number,
    value: GItem,
  ): void {
    this._items[index] = value;
    this._$items$.emit(this._items);
  }
}

/*---------------------*/

export function observableArrayExample() {
  // const subscription = new Subscription(
  //   fromEventTarget<'mousemove', MouseEvent>(window, 'mousemove'),
  //   (event: MouseEvent) => {
  //     console.log(event.clientX, event.clientY);
  //   },
  // );
  //
  // const subscribe = fromEventTarget(window, 'click');
  //
  // subscribe(() => {
  //   subscription.toggle();
  // });
}
