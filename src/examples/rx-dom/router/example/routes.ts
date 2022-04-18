import { ICanActivateFunctionReturnedValue, IRXRoutesList, navigateTo } from '@lirx/router';
import { mergeMapS$$, singleN, timeout } from '@lirx/core';
import { AppSubListPageComponent } from '../pages/sub-list/sub-list.page.component';
import { AppHomePageComponent } from '../pages/home/home.page.component';
import { AppProductPageComponent } from '../pages/product/product.page.component';
import { AppListPageComponent } from '../pages/list/list.page.component';
import { AppNotFoundPageComponent } from '../pages/404/not-found.page.component';

const listChildRoutes: IRXRoutesList = [
  {
    path: '/',
  },
  {
    path: '/sub',
    component: AppSubListPageComponent,
  },
];

export const APP_ROUTES: IRXRoutesList = [
  {
    path: '/home',
    component: AppHomePageComponent,
  },
  {
    path: '/product/:productId',
    component: AppProductPageComponent,
  },
  {
    path: '/list',
    component: AppListPageComponent,
    children: [
      {
        path: '/async',
        canActivate: () => {
          return mergeMapS$$(timeout(2000), () => singleN<ICanActivateFunctionReturnedValue>(true));
        },
        children: listChildRoutes,
      },
      ...listChildRoutes,
    ],
  },
  {
    path: '/forbidden',
    canActivate: navigateTo('/home'),
  },
  {
    path: '/**',
    component: AppNotFoundPageComponent,
  },
];

