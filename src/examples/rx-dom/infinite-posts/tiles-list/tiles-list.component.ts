import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, DEFAULT_FROM_CONSTANTS_TO_IMPORT, OnConnect, OnCreate, OnDisconnect
} from '@lifaon/rx-dom';
import {
  IDefaultNotificationsUnion, IObservable, Subscription, SubscriptionManager, mutateReadonlyReplayLastSourceArray, let$$
} from '@lifaon/rx-js-light';
// @ts-ignore
import style from './tiles-list.component.scss';
// @ts-ignore
import html from './tiles-list.component.html?raw';
import { createInfiniteScrollObservable } from '../helpers/infinite-scroll';
import { fetchMonkeyUsersPosts, IMonkeyUserResponse } from '../services/fetch-monkey-user-posts';
import { fetchNineGagPosts } from '../services/fetch-nine-gag-posts';
import { IResource } from '../services/resource.type';
import { filter$$ } from '../../../../../../rx-js-light/dist/src/observable/pipes/built-in/without-notifications/observer-pipe-related/filter/filter-observable.shortcut';
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

function debugNineGag(): void {
  const subNineGag = fetchNineGagPosts({
    section: 'hot',
  });

  subNineGag((result) => {
    console.log(result);
  });
}

/*---------------------*/

// interface ITileResource {
//   $kind: IObservable<IResourceKind>;
// }
//
// interface ITileImageResource extends ITileResource {
//   url: IObservable<string>;
// }

interface ITile {
  title: string;
  resource: IResource;
}


interface IData {
  readonly tiles$: IObservable<readonly ITile[]>;
  readonly loading$: IObservable<boolean>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_FROM_CONSTANTS_TO_IMPORT,
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-tiles-list',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  styles: [compileReactiveCSSAsComponentStyle(style)],
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
        createInfiniteScrollObservable({ scrollElement: this }),
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
      tiles$: $tiles$.subscribe,
      loading$: $loading$.subscribe,
    };
  }

  onCreate(): IData {
    return this.data;
  }

  onConnect(): void {
    // this.subscriptions.activateAll();
  }

  onDisconnect(): void {
    this.subscriptions.deactivateAll();
  }
}

