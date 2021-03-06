import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, DEFAULT_CONSTANTS_TO_IMPORT,
  DEFAULT_FROM_CONSTANTS_TO_IMPORT,
  OnConnect, OnCreate, OnDisconnect
} from '@lifaon/rx-dom';
import {
  createMulticastReplayLastSource, filterSubscribePipe, IDefaultNotificationsUnion, IGenericSource,
  IMulticastReplayLastSource, IReplayLastSource, ISubscribeFunction, of, pipeSubscribeFunction, Subscription,
  SubscriptionManager
} from '@lifaon/rx-js-light';
// @ts-ignore
import style from './tiles-list.component.scss';
// @ts-ignore
import html from './tiles-list.component.html?raw';
import { createInfiniteScrollSubscribeFunction } from '../helpers/infinite-scroll';
import { fetchNineGagPosts, INineGagJSONResponse } from '../services/fetch-nine-gag-posts';
import {
  fetchMonkeyUsersPosts, IMonkeyUserResponse, IResource, IResourceKind
} from '../services/fetch-monkey-user-posts';


export function mutateReadonlyReplayLastSourceArray<GItem>(
  source: IReplayLastSource<readonly GItem[], IGenericSource>,
  callback: (items: GItem[]) => void
): void {
  const items: readonly GItem[] = source.getValue();
  callback(items as GItem[]);
  source.emit(items);
}

/*---------------------*/

// interface ITileResource {
//   $kind: ISubscribeFunction<IResourceKind>;
// }
//
// interface ITileImageResource extends ITileResource {
//   url: ISubscribeFunction<string>;
// }

interface ITile {
  title: string;
  resource: IResource;
}


interface IData {
  readonly $tiles$: IMulticastReplayLastSource<readonly ITile[]>;
  readonly $loading$: IMulticastReplayLastSource<boolean>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_FROM_CONSTANTS_TO_IMPORT,
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-tiles-list',
  template: compileReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(style),
})
export class AppTilesListComponent extends HTMLElement implements OnCreate<IData>, OnConnect, OnDisconnect {

  protected readonly subscriptions: SubscriptionManager;

  protected readonly data: IData;

  protected next: string | undefined | null;

  constructor() {
    super();
    this.subscriptions = new SubscriptionManager();
    this.next = void 0;

    this.data = {
      $tiles$: createMulticastReplayLastSource<readonly ITile[]>({ initialValue: [] }),
      $loading$: createMulticastReplayLastSource<boolean>({ initialValue: false }),
    };

    this.subscriptions.set('infinite-scroll', new Subscription(
      pipeSubscribeFunction(createInfiniteScrollSubscribeFunction({ scrollElement: this }), [
        filterSubscribePipe(() => !this.data.$loading$.getValue())
      ]),
      () => {
        this.data.$loading$.emit(true);

        this.subscriptions.set('fetch', new Subscription(
          fetchMonkeyUsersPosts({ next: this.next as (string | undefined) }),
          (
            notification: IDefaultNotificationsUnion<IMonkeyUserResponse>
          ) => {
            switch (notification.name) {
              case 'next': {
                this.next = notification.value.next;
                mutateReadonlyReplayLastSourceArray(this.data.$tiles$, (items: ITile[]) => {
                  items.push({
                    title: '',
                    resource: notification.value.resource,
                  });
                });
              }
                break;
              case 'complete':
                this.subscriptions.delete('fetch');
                this.data.$loading$.emit(false);
                break;
              case 'error':
                throw notification.value;
            }
          }
        ).activate());
      }),
    );
  }

  onCreate(): IData {
    return this.data;
  }

  onConnect(): void {
    this.subscriptions.activateAll();
  }

  onDisconnect(): void {
    this.subscriptions.deactivateAll();
  }
}

