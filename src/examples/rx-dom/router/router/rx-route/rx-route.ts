import { HTMLElementConstructor } from '@lifaon/rx-dom';

import {
  locateRouterOutletElement, locateRouterOutletElementWithNotifications, ROUTER_OUTLET_ATTRIBUTE_NAME,
} from '../router-outlet/rx-router-outlet';
import { convertRoutePathToRegExp } from '../route/functions/convert-route-path-to-reg-exp';
import { normalizeRoutePath } from '../route/functions/normalize-route-path';
import { ICanActivateFunction } from '../route/can-activate/can-activate-function.type';
import { DEFAULT_CAN_ACTIVATE_FUNCTION } from '../route/can-activate/default-can-activate-function.constant';
import { IRoute } from '../route/route.type';
import { IRoutesList } from '../route/list/routes-list.type';
import { ILoadRoutesListFunction, ILoadRoutesListFunctionReturn } from '../route/list/load-routes-list-function.type';
import { IResolvedRoute } from '../route/resolved/resolved-route.type';
import { IMatchingResolvedRoute } from '../route/resolved/matching-resolved-route.type';
import {
  fulfilled$$$, IDefaultNotificationsUnion, IObservable, isAbortError, pipe$$, singleN,
} from '@lifaon/rx-js-light';

/** GENERIC ROUTE **/

/* ROUTE */

export interface IRXRoute {
  path: string;
  children?: IRXRoutesListOrLoadRXRoutesListFunction;
  canActivate?: ICanActivateFunction;
  component?: IRXRouteComponentOrLoadRXRouteComponentFunction;
  locateRXRouterOutletElement?: ILocateRXRouterOutletFunction;
  forceComponentReload?: boolean;
}

// LIST

export type IRXRoutesList = readonly IRXRoute[];

export type ILoadRXRoutesListFunctionReturnedObservableValue = IDefaultNotificationsUnion<IRXRoutesList>;
export type ILoadRXRoutesListFunctionReturn = IObservable<ILoadRXRoutesListFunctionReturnedObservableValue>;

export interface ILoadRXRoutesListFunction {
  (): ILoadRXRoutesListFunctionReturn;
}

export type IRXRoutesListOrLoadRXRoutesListFunction =
  IRXRoutesList
  | ILoadRXRoutesListFunction
  ;

// COMPONENT

export type IRXRouteComponent = HTMLElementConstructor;
export type IOptionalRXRouteComponent = IRXRouteComponent | null;

export type ILoadRXRouteComponentFunctionReturnedObservableValue = IDefaultNotificationsUnion<IOptionalRXRouteComponent>;
export type ILoadRXRouteComponentFunctionReturn = IObservable<ILoadRXRouteComponentFunctionReturnedObservableValue>;

export interface ILoadRXRouteComponentFunction {
  (): ILoadRXRouteComponentFunctionReturn;
}

export type IRXRouteComponentOrLoadRXRouteComponentFunction =
  IOptionalRXRouteComponent
  | ILoadRXRouteComponentFunction
  ;

// export type ILoadRXRouteComponentFunctionOrNull = ILoadRXRouteComponentFunction | null;


// LOCATE ROUTER OUTLET

export type IRXRouterOutletElement = Element;

export type ILocateRXRouterOutletFunctionReturnedObservableValue = IDefaultNotificationsUnion<IRXRouterOutletElement>;
export type ILocateRXRouterOutletFunctionReturn = IObservable<ILocateRXRouterOutletFunctionReturnedObservableValue>;

export interface ILocateRXRouterOutletFunction {
  (
    parentElement: Element,
  ): ILocateRXRouterOutletFunctionReturn;
}

export const DEFAULT_LOCATE_ROUTER_OUTLET: ILocateRXRouterOutletFunction = (
  parentElement: Element,
): IObservable<IDefaultNotificationsUnion<HTMLElement>> => {
  return locateRouterOutletElementWithNotifications(`[${ROUTER_OUTLET_ATTRIBUTE_NAME}]`, parentElement);
};


/** TO RESOLVABLE **/

export interface IRXRouteExtra {
  loadComponent: ILoadRXRouteComponentFunction;
  locateRXRouterOutletElement: ILocateRXRouterOutletFunction;
  forceComponentReload: boolean;
}

export type IResolvableRXRoute = IRoute<IRXRouteExtra>;
export type IResolvedRXRoute = IResolvedRoute<IRXRouteExtra>;
export type IMatchingResolvedRXRoute = IMatchingResolvedRoute<IRXRouteExtra>;


export function rxRouteToResolvableRoute(
  {
    path,
    children,
    canActivate = DEFAULT_CAN_ACTIVATE_FUNCTION,
    component,
    locateRXRouterOutletElement = DEFAULT_LOCATE_ROUTER_OUTLET,
    forceComponentReload = false,
  }: IRXRoute,
): IResolvableRXRoute {
  return {
    path: convertRoutePathToRegExp(normalizeRoutePath(path)),
    canActivate,
    loadChildren: createLoadRXRouteChildrenAsResolvableRouteFunction(children),

    extra: {
      loadComponent: createLoadRXRouteComponentFunction(component),
      locateRXRouterOutletElement,
      forceComponentReload,
    },
  };
}

export function genericRoutesListToResolvableRoutesList(
  routes: IRXRoutesList,
): IResolvableRXRoute[] {
  return routes.map(rxRouteToResolvableRoute);
}

// CHILDREN

function createLoadRXRouteChildrenFunction(
  children: IRXRoutesListOrLoadRXRoutesListFunction | undefined,
): ILoadRXRoutesListFunction {
  return (children === void 0)
    ? (): ILoadRXRoutesListFunctionReturn => {
      return singleN<IRXRoutesList>([]);
    }
    : (
      (typeof children === 'function')
        ? children
        : (): ILoadRXRoutesListFunctionReturn => {
          return singleN<IRXRoutesList>(children);
        }
    );
}

export type IRXResolvableRoutesList = IRoutesList<IRXRouteExtra>;
export type ILoadRXResolvableRoutesListFunctionReturn = ILoadRoutesListFunctionReturn<IRXRouteExtra>;
export type ILoadRXResolvableRoutesListFunction = ILoadRoutesListFunction<IRXRouteExtra>;

function createLoadRXRouteChildrenAsResolvableRouteFunction(
  children: IRXRoutesListOrLoadRXRoutesListFunction | undefined,
): ILoadRXResolvableRoutesListFunction {
  const loadChildren: ILoadRXRoutesListFunction = createLoadRXRouteChildrenFunction(children);
  return (): ILoadRXResolvableRoutesListFunctionReturn => {
    return pipe$$(loadChildren(), [
      fulfilled$$$((children: IRXRoutesList): ILoadRXResolvableRoutesListFunctionReturn => {
        return singleN<IResolvableRXRoute[]>(children.map(rxRouteToResolvableRoute));
      }),
    ]);
  };
}

// function createLoadAndCacheRXRouteChildrenAsResolvableRouteFunction(
//   children: IRXRoutesListOrLoadRXRoutesListFunction | undefined,
// ): ILoadRXResolvableRoutesListFunction {
//   const loadChildren: ILoadRXResolvableRoutesListFunction = createLoadRXRouteChildrenAsResolvableRouteFunction(children);
//   let children$: ILoadRXResolvableRoutesListFunctionReturn;
//   return (): ILoadRXResolvableRoutesListFunctionReturn => {
//     if (children$ === void 0) {
//       children$ = shareR$$(loadChildren());
//       // TODO reset children$ if errored
//     }
//     return children$;
//   };
// }


// COMPONENT

function createLoadRXRouteComponentFunction(
  component: IRXRouteComponentOrLoadRXRouteComponentFunction | undefined,
): ILoadRXRouteComponentFunction {
  return (component === void 0)
    ? (): ILoadRXRouteComponentFunctionReturn => {
      return singleN<IOptionalRXRouteComponent>(null);
    }
    : (
      (typeof component === 'function')
        ? component as ILoadRXRouteComponentFunction
        : (): ILoadRXRouteComponentFunctionReturn => {
          return singleN<IOptionalRXRouteComponent>(component);
        }
    );
}

// function createLoadAndCacheRXRouteComponentFunction(
//   component: IRXRouteComponentOrLoadRXRouteComponentFunction | undefined,
// ): ILoadRXRouteComponentFunctionOrNull {
//   const loadComponent: ILoadRXRouteComponentFunctionOrNull = createLoadRXRouteComponentFunction(component);
//   if (loadComponent === null) {
//     return null;
//   } else {
//     let promise: Promise<IRXRouteComponent> | undefined;
//     return (
//       signal: AbortSignal,
//     ): Promise<IRXRouteComponent> => {
//       if (promise === void 0) {
//         promise = loadComponent(signal)
//           .catch((error: unknown): never => {
//             if (isAbortError(error)) {
//               promise = void 0;
//             }
//             throw error;
//           });
//       }
//       return promise;
//     };
//   }
// }

/** LOAD COMPONENTS **/

// export interface IRXRouteWithLoadedComponentExtra extends Omit<IRXRouteExtra, 'loadComponent'> {
//   component: IRXRouteComponent | null;
// }
//
// export type IResolvedRXRouteWithLoadedComponent = IResolvedRoute<IRXRouteWithLoadedComponentExtra>;
// export type IMatchingResolvedRXRouteWithLoadedComponent = IMatchingResolvedRoute<IRXRouteWithLoadedComponentExtra>;
//
//
// export function loadResolvedRXRouteComponents(
//   route: IResolvedRXRoute,
//   signal: AbortSignal,
// ): Promise<IResolvedRXRouteWithLoadedComponent> {
//   return (route.state === 'matching')
//     ? loadMatchingResolvedRXRouteComponents(route, signal)
//     : (
//       signal.aborted
//         ? DEFAULT_ABORTED_PROMISE_FACTORY(signal)
//         : Promise.resolve<IResolvedRXRouteWithLoadedComponent>(route)
//     );
// }
//
// export function loadMatchingResolvedRXRouteComponents(
//   {
//     childRoute,
//     extra,
//     ...route
//   }: IMatchingResolvedRXRoute,
//   signal: AbortSignal,
// ): Promise<IMatchingResolvedRXRouteWithLoadedComponent> {
//   const {
//     loadComponent,
//   } = extra;
//
//   return Promise.all([
//     (loadComponent === null)
//       ? null
//       : loadComponent(signal),
//     (childRoute === null)
//       ? null
//       : loadMatchingResolvedRXRouteComponents(childRoute, signal),
//   ])
//     .then(wrapFunctionWithAbortSignalAndThrow(([component, childRoute]): IMatchingResolvedRXRouteWithLoadedComponent => {
//       return {
//         ...route,
//         childRoute,
//         extra: {
//           ...extra,
//           component,
//         },
//       };
//     }, signal));
// }
