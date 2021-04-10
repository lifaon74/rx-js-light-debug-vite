import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, DEFAULT_FROM_CONSTANTS_TO_IMPORT, OnConnect, OnCreate, OnDisconnect
} from '@lifaon/rx-dom';
import {
  IDefaultNotificationsUnion, IGenericSource, IReplayLastSource, ISubscribeFunction, Subscription, SubscriptionManager
} from '@lifaon/rx-js-light';
// @ts-ignore
import style from './tiles-list.component.scss';
// @ts-ignore
import html from './tiles-list.component.html?raw';
import { createInfiniteScrollSubscribeFunction } from '../helpers/infinite-scroll';
import { fetchMonkeyUsersPosts, IMonkeyUserResponse, IResource } from '../services/fetch-monkey-user-posts';
import { filter$$, let$$ } from '@lifaon/rx-js-light-shortcuts';
// @ts-ignore
// import styleUrl from './tiles-list.component.css?url';

// function loadCSS() {
//   const url = new URL('./tiles-list.component.css?url', import.meta.url).href;
//   return fetch(url)
//     .then((response: Response) => response.text());
// }
//
// console.log(styleUrl);
// console.log(await loadCSS());

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
  readonly tiles: ISubscribeFunction<readonly ITile[]>;
  readonly loading: ISubscribeFunction<boolean>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_FROM_CONSTANTS_TO_IMPORT,
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-tiles-list',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
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

    const $tiles$ = let$$<readonly ITile[]>([]);
    const $loading$ = let$$<boolean>(false);


    this.subscriptions.set('infinite-scroll', new Subscription(
      filter$$(
        createInfiniteScrollSubscribeFunction({ scrollElement: this }),
        () => !$loading$.getValue()
      ),
      () => {
        $loading$.emit(true);

        this.subscriptions.set('fetch', new Subscription(
          fetchMonkeyUsersPosts({ next: this.next as (string | undefined) }),
          (
            notification: IDefaultNotificationsUnion<IMonkeyUserResponse>
          ) => {
            switch (notification.name) {
              case 'next': {
                this.next = notification.value.next;
                mutateReadonlyReplayLastSourceArray($tiles$, (items: ITile[]) => {
                  items.push({
                    title: '',
                    resource: notification.value.resource,
                  });
                });
              }
                break;
              case 'complete':
                this.subscriptions.delete('fetch');
                $loading$.emit(false);
                break;
              case 'error':
                throw notification.value;
            }
          }
        ).activate());
      }),
    );

    this.data = {
      tiles: $tiles$.subscribe,
      loading: $loading$.subscribe,
    };
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

