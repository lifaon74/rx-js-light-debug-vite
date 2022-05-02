import { IRXRoutesList, navigateTo } from '@lirx/router';
import { fromPromise, mergeMapS$$, singleN, timeout } from '@lirx/core';
import { createSlugs } from '../slugs/create-slugs';
import { SLUGS } from './slugs';

const listChildRoutes: IRXRoutesList = [
  {
    path: '/',
  },
  {
    path: '/sub',
    component: () => {
      return fromPromise(import('../pages/sub-list//sub-list.page.component').then(_ => _.AppSubListPageComponent));
    },
  },
];

export const APP_ROUTES_ASYNC: IRXRoutesList = [
  {
    path: '/home',
    // canActivate: () => {
    //   return mergeMapS$$(timeout(2000), () => singleN<ICanActivateFunctionReturnedValue>(true));
    // },
    component: () => {
      return fromPromise(import('../pages/home/home.page.component').then(_ => _.AppHomePageComponent));
    },
  },
  {
    path: '/product/:productId',
    component: () => {
      return fromPromise(import('../pages/product/product.page.component').then(_ => _.AppProductPageComponent));
    },
  },
  {
    path: '/list',
    component: () => {
      return fromPromise(import('../pages/list/list.page.component').then(_ => _.AppListPageComponent));
    },
    children: [
      {
        path: '/async',
        children: () => {
          return mergeMapS$$(timeout(2000), () => singleN<IRXRoutesList>(listChildRoutes));
        },
      },
      ...listChildRoutes,
    ],
  },
  {
    path: '/forbidden',
    canActivate: navigateTo('/home'),
  },
  ...createSlugs(SLUGS, '/slugs'),
  {
    path: '/**',
    component: () => {
      return fromPromise(import('../pages/404/not-found.page.component').then(_ => _.AppNotFoundPageComponent));
    },
  },
];

