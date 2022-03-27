import { IMulticastReplayLastSource, IObservable, let$$ } from '@lifaon/rx-js-light';


export interface IObservableArrayMutateFunction<GItem, GReturn> {
  (
    items: GItem[],
  ): GReturn;
}

export class ObservableArray<GItem> {
  public readonly subscribe: IObservable<readonly GItem[]>;

  protected readonly _$items$: IMulticastReplayLastSource<readonly GItem[]>;

  constructor(
    items?: Iterable<GItem>,
  ) {
    this._$items$ = let$$<readonly GItem[]>(
      items
        ? Array.from(items)
        : [],
    );
    this.subscribe = this._$items$.subscribe;
  }

  get items(): readonly GItem[] {
    return this._$items$.getValue();
  }

  length(): number {
    return this.items.length;
  }

  mutate<GReturn>(
    callback: IObservableArrayMutateFunction<GItem, GReturn>,
  ): GReturn {
    const result: GReturn = callback(this.items as GItem[]);
    this._$items$.emit(this.items);
    return result;
  }

  get(
    index: number,
  ): GItem {
    return this.items[index];
  }

  set(
    index: number,
    value: GItem,
  ): void {
    this.mutate((items: GItem[]): void => {
      items[index] = value;
    });
  }

  push(
    ...values: GItem[]
  ): number {
    return this.mutate((items: GItem[]): number => {
      return items.push(...values);
    });
  }

  pop(): GItem | undefined {
    return this.mutate((items: GItem[]): GItem | undefined => {
      return items.pop();
    });
  }

  unshift(
    ...values: GItem[]
  ): number {
    return this.mutate((items: GItem[]): number => {
      return items.unshift(...values);
    });
  }

  shift(): GItem | undefined {
    return this.mutate((items: GItem[]): GItem | undefined => {
      return items.shift();
    });
  }

  splice(
    start: number,
    deleteCount: number,
    ...values: GItem[]
  ): GItem[] {
    return this.mutate((items: GItem[]): GItem[] => {
      return items.splice(start, deleteCount, ...values);
    });
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
