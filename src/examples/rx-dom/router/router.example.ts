import { Path } from './path/path.class';
import {
  createDefaultInjectParentComponent, createRouteResolver, createRoutesResolver,
  IRouteResolveInjectParentComponentFunction, IRouteResolveUndoFunction, navigateTo
} from './router/route/route';
import { isRedirectToError } from './router/errors/redirect-to-error/redirect-to-error';
import { NAVIGATION } from './navigation/navigation';
import { getLocation } from './navigation/get-location';
import { getBaseURI } from './navigation/get-base-uri';


async function routerExample1() {
  // TODO finish
  const routes = [
    createRouteResolver({
      path: new Path('/home'),
      component: () => {
        return import('./pages/home/home.page.component').then(_ => _.AppHomePageComponent);
      },
    }),
    createRouteResolver({
      path: new Path('/product/:productId'),
      component: () => {
        return import('./pages/product/product.page.component').then(_ => _.AppProductPageComponent);
      },
    }),
    createRouteResolver({
      path: new Path('/list'),
      component: () => {
        return import('./pages/list/list.page.component').then(_ => _.AppListPageComponent);
      },
      children: [
        createRouteResolver({
          path: new Path('/'),
        }),
        createRouteResolver({
          path: new Path('/sub'),
          component: () => {
            return import('./pages/sub-list//sub-list.page.component').then(_ => _.AppSubListPageComponent);
          },
        }),
      ],
    }),
    createRouteResolver({
      path: new Path('/forbidden'),
      canActivate: navigateTo(new Path('/home')),
    }),
    createRouteResolver({
      path: new Path('/**'),
      component: () => {
        return import('./pages/404/not-found.page.component').then(_ => _.AppNotFoundPageComponent);
      },
    }),
  ];

  const resolver = createRoutesResolver(routes);

  let previousUndoFunction: IRouteResolveUndoFunction;

  const DEFAULT_INJECT_PARENT_COMPONENT: IRouteResolveInjectParentComponentFunction = createDefaultInjectParentComponent();

  const update = async () => {
    try {
      previousUndoFunction = await resolver({
        path: getCurrentPath(),
        params: {},
        injectParentComponent: DEFAULT_INJECT_PARENT_COMPONENT,
        previousUndoFunction,
      });
    } catch (error: unknown) {
      if (isRedirectToError(error)) {
        NAVIGATION.navigate(error.url);
      } else {
        throw error;
      }
    }
  };

  const getCurrentPath = (): Path => {
    const currentPathName: string = getLocation().pathname;
    const baseURIPathName: string = new URL(getBaseURI()).pathname;
    // getLocation().pathname.replace(new URL(getBaseURI()).pathname, '')
    return new Path(
      currentPathName.startsWith(baseURIPathName)
        ? currentPathName.slice(baseURIPathName.length)
        : currentPathName,
    );
  };

  NAVIGATION.onChange(update);
  update();

  console.log(new DOMParser().parseFromString(`<span [myAttr]="5"></span>`, 'text/html'));
}

/*-----------------*/


export async function routerExample() {
  await routerExample1();
}

