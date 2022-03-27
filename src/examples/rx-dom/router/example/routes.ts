import { IRXRoutesList, navigateTo } from '@lifaon/rx-router';
import { fromPromise, mergeMapS$$, singleN, timeout } from '@lifaon/rx-js-light';

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

export const APP_ROUTES: IRXRoutesList = [
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
  {
    path: '/**',
    component: () => {
      return fromPromise(import('../pages/404/not-found.page.component').then(_ => _.AppNotFoundPageComponent));
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

