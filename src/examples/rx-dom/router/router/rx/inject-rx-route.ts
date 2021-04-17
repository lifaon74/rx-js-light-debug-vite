import {
  IInjectedRXRoute, IInjectedRXRoutes, IResolvedRXRoute, IResolvedRXRoutes, IRXRouteExtra, IRXRouteExtraProp
} from './rx-route.type';
import { HTMLElementConstructor, IParentNode, nodeAppendChild, nodeRemoveChildren, OnInit } from '@lifaon/rx-dom';
import { locateRouterOutletElement, normalizeRouterOutletSelector } from './rx-router-outlet';
import {
  abortSignalPromiseBranching, createAbortError, fromEventTarget, wrapPromiseFactoryWithAbortSignal
} from '@lifaon/rx-js-light';


// function areEquivalentRXRouteExtra(
//   extraA: IRXRouteExtra,
//   extraB: IRXRouteExtra,
// ): boolean {
//   return (normalizeRouterOutletSelector(extraA.routerOutletSelector) === normalizeRouterOutletSelector(extraB.routerOutletSelector))
//     && (extraA.component === extraB.component);
// }

function areEquivalentInjectedRXRoute(
  routeA: IInjectedRXRoute,
  routeB: IInjectedRXRoute,
): boolean {
  return (routeA.routerOutletElement === routeB.routerOutletElement)
    && (routeA.extra.component === routeB.extra.component);
}


function resolveRXRouteExtraProp(
  extra: IRXRouteExtraProp | undefined,
  signal: AbortSignal,
): Promise<IRXRouteExtra> {
  return (extra === void 0)
    ? abortSignalPromiseBranching(signal, () => Promise.resolve<IRXRouteExtra>({}))
    : (
      (typeof extra === 'function')
        ? wrapPromiseFactoryWithAbortSignal(extra, signal)
        : abortSignalPromiseBranching(signal, () => Promise.resolve(extra))
    );
}


interface IComponentWithOptionalOnInit extends HTMLElement, Partial<OnInit> {
}

function createAndAwaitComponentInit(
  componentConstructor: HTMLElementConstructor,
  signal: AbortSignal,
): Promise<HTMLElement> {
  return wrapPromiseFactoryWithAbortSignal<HTMLElement>((signal: AbortSignal) => {
    return new Promise<HTMLElement>((
      resolve: (value: HTMLElement) => void,
      reject: (reason?: any) => void,
    ): void => {
      const component: IComponentWithOptionalOnInit = new componentConstructor();
      const onInit: OnInit['onInit'] | undefined = component.onInit;

      const end = (triggerInit: boolean) => {
        unsubscribeAbort();
        if (onInit !== void 0) {
          component.onInit = onInit;
          if (triggerInit) {
            onInit.call(component);
          }
        }
      };

      const _resolve = (value: HTMLElement) => {
        end(true);
        resolve(value);
      };


      const _reject = (error: any) => {
        end(false);
        reject(error);
      };

      const unsubscribeAbort = fromEventTarget(signal, 'abort')(() => {
        _reject(createAbortError({ signal }));
      });

      component.onInit = () => {
        _resolve(component);
      };
    });
  }, signal);
}

export async function injectRXRoute(
  routes: IResolvedRXRoutes,
  previousRoutes: IInjectedRXRoutes,
  parentNode: IParentNode,
  signal: AbortSignal,
): Promise<IInjectedRXRoute[]> {
  const injectedRoutes: IInjectedRXRoute[] = [];
  const previousRoutesLength: number = previousRoutes.length;

  let diverged: boolean = false;

  const diverge = (i: number) => {
    diverged = true;
    for (; i < previousRoutesLength; i++) {
      const routerOutletElement: HTMLElement | null = previousRoutes[i].routerOutletElement;
      if (routerOutletElement !== null) {
        nodeRemoveChildren(routerOutletElement);
        break;
      }
    }
  };

  for (let i = 0, l = routes.length; i < l; i++) {
    const route: IResolvedRXRoute = routes[i];
    const extra: IRXRouteExtra = await resolveRXRouteExtraProp(route.extra, signal);

    const routerOutletSelector: string | undefined = extra.routerOutletSelector;
    const componentConstructor: HTMLElementConstructor | undefined = extra.component;

    const routerOutletElement: HTMLElement | null = ((routerOutletSelector === void 0) && (componentConstructor === void 0))
      ? null
      : await locateRouterOutletElement(normalizeRouterOutletSelector(extra.routerOutletSelector), parentNode, signal);

    const injectedRoute: IInjectedRXRoute = {
      route,
      extra,
      routerOutletElement,
    };

    injectedRoutes.push(injectedRoute);

    if (routerOutletElement !== null) {
      parentNode = routerOutletElement;
    }

    if (!diverged) {
      if (
        (i < previousRoutesLength)
        && (areEquivalentInjectedRXRoute(previousRoutes[i], injectedRoute))
      ) {
        continue;
      } else {
        diverge(i);
      }
    }

    if (componentConstructor !== void 0) {
      nodeAppendChild(parentNode, await createAndAwaitComponentInit(componentConstructor, signal));
    }
  }

  return injectedRoutes;
}


// export async function injectRXRoute(
//   routes: IResolvedRXRoutes,
//   previousRoutes: IInjectedRXRoutes,
//   parentNode: IParentNode,
//   signal: AbortSignal,
// ): Promise<IInjectedRXRoute[]> {
//   const injectedRoutes: IInjectedRXRoute[] = [];
//
//   // let currentRouterOutletElement: HTMLElement | null = null;
//   let i: number = 0;
//   const routesLength: number = routes.length;
//
//
//   // for (const l: number = previousRoutes.length; i < l; i++) {
//   //   const previousRoute: IInjectedRXRoute = previousRoutes[i];
//   //
//   //   routerElement = previousRoute.routerOutlet;
//   //
//   //   if (i < routesLength) {
//   //     const route: IResolvedRXRoute = routes[i];
//   //     const routeExtra: IRXRouteExtra =
//   //   }
//   //
//   //   // if (
//   //   //   (route !== void 0)
//   //   //   && areEquivalentRXRouteExtra(previousRouteExtra, route.extra)
//   //   // ) {
//   //   //   if (routerElement !== void 0) {
//   //   //     parentNode = routerElement;
//   //   //   }
//   //   // } else {
//   //   //   if (routerElement !== void 0) {
//   //   //     // console.log('remove');
//   //   //     nodeRemoveChildren(routerElement);
//   //   //   }
//   //   //   break;
//   //   // }
//   // }
//
//   for (const l: number = previousRoutes.length; i < l; i++) {
//     const previousRoute: IInjectedRXRoute = previousRoutes[i];
//
//     if (i < routesLength) {
//       const route: IResolvedRXRoute = routes[i];
//       const routeExtra: IRXRouteExtra = await resolveRXRouteExtraProp(route.extra, signal); // TODO deduplicate
//
//       if (areEquivalentRXRouteExtra(previousRoute.extra, routeExtra)) {
//
//         const routerOutletElement: HTMLElement | null = previousRoute.routerOutletElement;
//
//         const injectedRoute: IInjectedRXRoute = {
//           route,
//           extra: routeExtra,
//           routerOutletElement,
//         }
//
//         injectedRoutes.push(injectedRoute);
//
//         if (routerOutletElement !== null) {
//           parentNode = routerOutletElement;
//         }
//       } else {
//         break;
//       }
//     } else {
//       console.log('remove', parentNode);
//       nodeRemoveChildren(parentNode);
//     }
//
//     // if (
//     //   (route !== void 0)
//     //   && areEquivalentRXRouteExtra(previousRouteExtra, route.extra)
//     // ) {
//     //   if (routerElement !== void 0) {
//     //     parentNode = routerElement;
//     //   }
//     // } else {
//     //   if (routerElement !== void 0) {
//     //     // console.log('remove');
//     //     nodeRemoveChildren(routerElement);
//     //   }
//     //   break;
//     // }
//   }
//
//   for (; i < routesLength; i++) {
//     const route: IResolvedRXRoute = routes[i];
//     const extra: IRXRouteExtra = await resolveRXRouteExtraProp(route.extra, signal);
//
//     const routerOutletSelector: string | undefined = extra.routerOutletSelector;
//     const componentConstructor: HTMLElementConstructor | undefined = extra.component;
//
//     const routerOutletElement: HTMLElement | null = ((routerOutletSelector === void 0) && (componentConstructor === void 0))
//       ? null
//       : await locateRouterOutletElement(normalizeRouterOutletSelector(extra.routerOutletSelector), parentNode, signal);
//
//     const injectedRoute: IInjectedRXRoute = {
//       route,
//       extra,
//       routerOutletElement,
//     }
//
//     injectedRoutes.push(injectedRoute);
//
//     if (routerOutletElement !== null) {
//       parentNode = routerOutletElement;
//     }
//
//     if (componentConstructor !== void 0) {
//       nodeAppendChild(parentNode, new componentConstructor());
//     }
//   }
//
//   return injectedRoutes;
// }
