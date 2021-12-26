import { normalizeRoutePath } from './router/route/functions/normalize-route-path';
import {
  genericRoutesListToResolvableRoutesList, IResolvableRXRoute, IResolvedRXRoute, IRXRouterOutletElement, IRXRoutesList,
} from './router/rx-route/rx-route';
import { navigateTo } from './router/route/can-activate/navigate-to';
import { resolveRoutes } from './router/route/resolve-route';
import {
  differInjectedComponents, injectMatchingResolvedRXRoute, IOptionalInjectedComponentsList,
} from './router/inject/inject';
import { createNotAValidPathForThisRouteError } from './router/errors/not-a-valid-path-for-this-route-error/not-a-valid-path-for-this-route-error';
import {
  compileReactiveHTMLAsGenericComponentTemplate,
  Component, createElement, getBaseURI, getDocumentBody, nodeAppendChild, OnCreate, removeNodeChildren,
} from '@lifaon/rx-dom';
import { NAVIGATION } from './navigation/navigation';
import { getLocation } from './navigation/get-location';
import {
  createMulticastSource,
  createNotification, emptyN, freeze, fromPromise, fulfilled$$$, ICompleteNotification, IDefaultNotificationsUnion,
  IErrorNotification, INotification, IObservable, IObserver, IUnsubscribe, let$$, letU$$, mergeMapS$$, pipe$$, single,
  singleN,
  throwError,
  timeout,
} from '@lifaon/rx-js-light';
import { ICanActivateFunctionReturnedValue } from './router/route/can-activate/can-activate-function.type';
import { INavigateTo } from './router/route/navigate-to/navigate-to.type';
import { AppMenuPageComponent } from './pages/components/menu/menu.component';
import { findDOMElement } from '../../misc/find-dom-element';


export interface ICreateRXRouterOptions {
  routes: IRXRoutesList;
  routerOutletElement: IRXRouterOutletElement;
}

export type IRXRouterNavigationState = 'idle' | 'updating';

export interface IRXRouter {
  readonly destroy: () => void;
  readonly state$: IObservable<IRXRouterNavigationState>;
  readonly error$: IObservable<any>;

}

function createRXRouter(
  {
    routes,
    routerOutletElement,
  }: ICreateRXRouterOptions,
): IRXRouter {
  const resolvableRoutes: IResolvableRXRoute[] = genericRoutesListToResolvableRoutesList(routes);

  let previouslyInjectedComponents: IOptionalInjectedComponentsList = [];
  let unsubscribeOfUpdate: IUnsubscribe | undefined = void 0;
  let destroyed: boolean = false;

  const { emit: $state, subscribe: state$ } = let$$<IRXRouterNavigationState>('idle');
  const { emit: $error, subscribe: error$ } = createMulticastSource<any>();

  type IRedirectNotification = INotification<'redirect', INavigateTo>;
  type IUpdateNotifications = ICompleteNotification | IErrorNotification | IRedirectNotification;

  const update = (): IObservable<IUpdateNotifications> => {
    const resolvedRoute$: IObservable<IDefaultNotificationsUnion<IResolvedRXRoute>> = resolveRoutes({
      routes: resolvableRoutes,
      path: getCurrentPath(),
      params: {},
    });

    return pipe$$(resolvedRoute$, [
      fulfilled$$$((resolvedRoute: IResolvedRXRoute): IObservable<IUpdateNotifications> => {
        switch (resolvedRoute.state) {
          case 'matching': {
            const inject$ = injectMatchingResolvedRXRoute({
              resolvedRoute,
              routerOutletElement,
            });

            return pipe$$(inject$, [
              fulfilled$$$((injectedComponents: IOptionalInjectedComponentsList): IObservable<ICompleteNotification> => {
                differInjectedComponents(
                  previouslyInjectedComponents,
                  injectedComponents,
                );
                previouslyInjectedComponents = injectedComponents;
                return emptyN();
              }),
            ]);
          }
          case 'not-matching':
            return throwError(createNotAValidPathForThisRouteError());
          case 'redirect':
            return single<IRedirectNotification>(createNotification('redirect', resolvedRoute.to));
        }
      }),
    ]);
  }

  const destroy = (): void => {
    if (!destroyed) {
      destroyed = true;
      if (unsubscribeOfUpdate !== void 0) {
        unsubscribeOfUpdate();
      }
      unsubscribeOfNavigationChange();
      differInjectedComponents(
        previouslyInjectedComponents,
        [],
      );
    }
  };

  const onNavigationChange = (): void => {
    if (unsubscribeOfUpdate !== void 0) {
      unsubscribeOfUpdate();
      unsubscribeOfUpdate = void 0;
    }
    $state('updating');
    unsubscribeOfUpdate = update()((notification: IUpdateNotifications): void => {
      queueMicrotask((): void => {
        $state('idle');
        unsubscribeOfUpdate = void 0;
        switch (notification.name) {
          case 'error':
            $error(notification.value);
            break;
          case 'redirect':
            NAVIGATION.navigate(notification.value);
            break;
        }
      });
    });
  };

  const getCurrentPath = (): string => {
    const currentPathName: string = getLocation().pathname;
    const baseURIPathName: string = new URL(getBaseURI()).pathname;
    return normalizeRoutePath(
      currentPathName.startsWith(baseURIPathName)
        ? currentPathName.slice(baseURIPathName.length)
        : currentPathName,
    );
  };


  const unsubscribeOfNavigationChange: IUnsubscribe = NAVIGATION.change$(onNavigationChange);
  onNavigationChange();

  return freeze({
    destroy,
    state$,
    error$,
  });
}



const routes: IRXRoutesList = [
  // {
  //   path: '/home',
  //   component: () => {
  //     return fromPromise(import('./pages/home/home.page.component').then(_ => _.AppHomePageComponent));
  //   },
  // },
  {
    path: '/home',
    canActivate: () => {
      return mergeMapS$$(timeout(2000), () => singleN<ICanActivateFunctionReturnedValue>(true));
    },
    component: () => {
      return fromPromise(import('./pages/home/home.page.component').then(_ => _.AppHomePageComponent));
    },
  },
  {
    path: '/product/:productId',
    component: () => {
      return fromPromise(import('./pages/product/product.page.component').then(_ => _.AppProductPageComponent));
    },
  },
  {
    path: '/list',
    component: () => {
      return fromPromise(import('./pages/list/list.page.component').then(_ => _.AppListPageComponent));
    },
    children: [
      {
        path: '/',
      },
      {
        path: '/sub',
        component: () => {
          return fromPromise(import('./pages/sub-list//sub-list.page.component').then(_ => _.AppSubListPageComponent));
        },
      },
    ],
  },
  {
    path: '/forbidden',
    canActivate: navigateTo('/home'),
  },
  {
    path: '/**',
    component: () => {
      return fromPromise(import('./pages/404/not-found.page.component').then(_ => _.AppNotFoundPageComponent));
    },
  },
];

// const routes: IRXRoutesList = [
//   {
//     path: '/home',
//     component: AppHomePageComponent,
//   },
//   {
//     path: '/product/:productId',
//     component: AppProductPageComponent,
//   },
//   {
//     path: '/list',
//     component: AppListPageComponent,
//     children: [
//       {
//         path: '/',
//       },
//       {
//         path: '/sub',
//         component: AppSubListPageComponent,
//       },
//     ],
//   },
//   {
//     path: '/forbidden',
//     canActivate: navigateTo('/home'),
//   },
//   {
//     path: '/**',
//     component: AppNotFoundPageComponent,
//   },
// ];


/** COMPONENT **/

interface IData {
}


@Component({
  name: 'app-main',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html: `
      <div class="loader"></div>
      <div rx-router-outlet></div>
    `,
  }),
})
export class AppMainComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly data: IData;

  constructor() {
    super();

    // findDOMElement()
    this.data = {};
  }

  public onCreate(): IData {
    return this.data;
  }
}



async function routerExample1() {



  const loaderElement = createElement('div');
  loaderElement.style.position = 'absolute';

  nodeAppendChild(getDocumentBody(), loaderElement);

  const routerOutletElement = createElement('div');
  nodeAppendChild(getDocumentBody(), routerOutletElement);

  const router = createRXRouter({
    routes,
    routerOutletElement,
  });

  router.error$(_ => console.log(_));
  router.state$(_ => console.log(_));

  (window as any).router = router;
}


/*-----------------*/


export async function routerExample() {
  await routerExample1();
}

