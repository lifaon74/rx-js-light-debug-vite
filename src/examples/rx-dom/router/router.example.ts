import { Path } from './router/path/path.class';
import { IRXRoute } from './router/rx/rx-route.type';
import { RXRouter } from './router/rx/rx-router.class';
import { AppNotFoundPageComponent } from './pages/404/not-found.page.component';
import { createRouteAliases } from './router/route/create-route-aliases';
import { generateRouterOutletHTML } from './router/rx/rx-router-outlet';


/*-----------------*/

// const routes: IRXRoute[] = [
//   {
//     path: new Path('/all'),
//     extra: {
//       component: AppProgressBarComponent,
//     },
//   },
//   {
//     path: new Path('/all2'),
//     extra: {
//       component: AppProgressBarComponent,
//     },
//   },
//   {
//     path: new Path('/single/:id'),
//     children: [
//       {
//         path: new Path('/a'),
//         extra: async () => {
//           return {
//             component: (await import('../progress-ring/progress-ring.component')).AppProgressRingComponent,
//           };
//         },
//       },
//       {
//         path: new Path('/**'),
//         extra: {
//           component: AppProgressBarComponent,
//         },
//       },
//     ],
//   },
//   {
//     path: new Path('/child'),
//     // component: AppProgressBarComponent,
//     children: [
//       {
//         path: new Path('/1'),
//         // component: AppProgressBarComponent,
//       },
//     ],
//   },
// ];

/*-----------------*/

const routes: IRXRoute[] = [
  ...createRouteAliases([
    new Path('/'),
    new Path('/home'),
  ], {
    // extra: {
    //   component: AppHomePageComponent,
    // },
    extra: async () => {
      return {
        component: (await import('./pages/home/home.page.component')).AppHomePageComponent,
      };
    },
  },),
  {
    path: new Path('/list'),
    extra: async () => {
      return {
        component: (await import('./pages/list/list.page.component')).AppListPageComponent,
      };
    },
    children: [
      {
        path: new Path('/'),
      },
      {
        path: new Path('/sub'),
        extra: async () => {
          return {
            component: (await import('./pages/sub-list/sub-list.page.component')).AppSubListPageComponent,
          };
        },
      },
    ]
  },
  {
    path: new Path('/**'),
    extra: {
      component: AppNotFoundPageComponent,
    },
  },
];

/*-----------------*/

async function routerExample1() {

  // debugNavigation();


  // <base href="/">

  // console.log(convertRoutePathToRegExp('/abc'));
  // console.log(convertRoutePathToRegExp('/:id'));
  // console.log(convertRoutePathToRegExp('/**'));
  // console.log(convertRoutePathToRegExp('/*'));
  // console.log(convertRoutePathToRegExp('/abc/:id/*/ijk/**'));

  document.body.innerHTML = `
    ${ generateRouterOutletHTML() }
  `;

  // const path = '/all';
  // const path = '/single/abc';
  // const path = '/single/abc/a';
  // const path = '/single/abc/b';
  // const path = '/child';

  // const resolvedRoutes = await resolveRXRoute(routes, new Path(path));
  // console.log(resolvedRoutes);
  // await injectRXRoute(resolvedRoutes);

  const router = new RXRouter(routes);
  router.refresh();
  // await router.update(new Path('/all'));
  // await router.update(new Path('/all2'));
  // await router.update(new Path('/single'));
  // await router.update(new Path('/single/10/a'));
  // await router.update(new Path('/single/10/a'));

  // await router.navigation.navigate(new URL('/single/10/a', window.origin));
  // await router.navigation.navigate(new URL('/all', window.origin));
  // await router.navigate(new URL('https://developer.mozilla.org/en-US/docs/Web/API/History/pushState'));

  (window as any).router = router;

}

/*-----------------*/


export async function routerExample() {

  // debugNavigation();

  document.body.innerHTML = `
    ${ generateRouterOutletHTML() }
  `;

  const router = new RXRouter(routes, {
    // onError: (error: any) => {
    //   console.error(error);
    //   document.body.innerHTML = `An unexpected error occurred`;
    // },
  });
  router.refreshAndCatch();

  (window as any).router = router;

}

