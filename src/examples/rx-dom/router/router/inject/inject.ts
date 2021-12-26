import {
  ILoadRXRouteComponentFunctionReturn, ILocateRXRouterOutletFunctionReturn, IMatchingResolvedRXRoute,
  IOptionalRXRouteComponent, IRXRouterOutletElement,
} from '../rx-route/rx-route';
import { nodeAppendChild, nodeRemove } from '@lifaon/rx-dom';
import {
  createMulticastReplayLastSource, fulfilled$$$, IDefaultNotificationsUnion, IMulticastReplayLastSource, IObservable,
  pipe$$, singleN,
} from '@lifaon/rx-js-light';
import { IRouteParams } from '../route/route-params/route-params.type';


/*--------------------------*/



export interface IInjectMatchingResolvedRXRouteOptions {
  resolvedRoute: IMatchingResolvedRXRoute;
  routerOutletElement: IRXRouterOutletElement;
}

export type IInjectedComponentState =
  'new'
  | 'recycled'
  ;

export interface IInjectedComponent {
  state: IInjectedComponentState;
  element: Element;
}

export type IOptionalInjectedComponent = IInjectedComponent | null;
export type IOptionalInjectedComponentsList = readonly IOptionalInjectedComponent[];
export type IInjectMatchingResolvedRXRouteReturnedObservableValue = IDefaultNotificationsUnion<IOptionalInjectedComponentsList>;


export function injectMatchingResolvedRXRoute(
  {
    resolvedRoute,
    routerOutletElement,
  }: IInjectMatchingResolvedRXRouteOptions,
): IObservable<IInjectMatchingResolvedRXRouteReturnedObservableValue> {

  const {
    params,
    childRoute,
    extra,
  } = resolvedRoute;

  const {
    locateRXRouterOutletElement,
    loadComponent,
    forceComponentReload,
  } = extra;

  const component$: ILoadRXRouteComponentFunctionReturn = (loadComponent === null)
    ? singleN<IOptionalRXRouteComponent>(null)
    : loadComponent();

  return pipe$$(component$, [
    fulfilled$$$((component: IOptionalRXRouteComponent): IObservable<IInjectMatchingResolvedRXRouteReturnedObservableValue> => {
      let injectedComponent: IInjectedComponent | null;

      if (component === null) {
        injectedComponent = null;
      } else {
        const routerOutletFirstElementChild: Element | null = routerOutletElement.firstElementChild;

        if (
          forceComponentReload
          || (routerOutletFirstElementChild === null)
          || (routerOutletFirstElementChild.constructor !== component)
        ) {
          const element: Element = nodeAppendChild(routerOutletElement, new component());
          injectedComponent = {
            state: 'new',
            element,
          };
          setRouteParams(element, params);
        } else {
          injectedComponent = {
            state: 'recycled',
            element: routerOutletFirstElementChild,
          };
          setRouteParams(routerOutletFirstElementChild, params);
        }
      }

      if (childRoute === null) {
        return singleN<IOptionalInjectedComponentsList>([
          injectedComponent,
        ]);
      } else {
        const childRouterOutletElement$: ILocateRXRouterOutletFunctionReturn = (component === null)
          ? singleN(routerOutletElement)
          : locateRXRouterOutletElement(routerOutletElement);

        return pipe$$(childRouterOutletElement$, [
          fulfilled$$$((childRouterOutletElement: IRXRouterOutletElement): IObservable<IInjectMatchingResolvedRXRouteReturnedObservableValue> => {
            return injectMatchingResolvedRXRoute({
              resolvedRoute: childRoute,
              routerOutletElement: childRouterOutletElement,
            });
          }),
          fulfilled$$$((injectedChildComponents: IOptionalInjectedComponentsList): IObservable<IInjectMatchingResolvedRXRouteReturnedObservableValue> => {
            return singleN<IOptionalInjectedComponentsList>([
              injectedComponent,
              ...injectedChildComponents,
            ]);
          }),
        ])
      }
    }),
  ]);
}


export function differInjectedComponents(
  previouslyInjectedComponents: IOptionalInjectedComponentsList,
  injectedComponents: IOptionalInjectedComponentsList,
): void {
  const injectedElements = new Set<Element>();
  for (let i = 0, l = injectedComponents.length; i < l; i++) {
    const injectedComponent: IOptionalInjectedComponent = injectedComponents[i];
    if (injectedComponent !== null) {
      injectedElements.add(injectedComponent.element);
    }
  }

  for (let i = 0, l = previouslyInjectedComponents.length; i < l; i++) {
    const previousInjectedComponent: IOptionalInjectedComponent = previouslyInjectedComponents[i];
    if (previousInjectedComponent !== null) {
      const element = previousInjectedComponent.element;
      if (!injectedElements.has(element)) {
        nodeRemove(element);
      }
    }
  }
}



/* PARAMS */

const COMPONENT_PARAMS = new WeakMap<Element, IMulticastReplayLastSource<IRouteParams>>();

function getRouteParamsSource(
  component: Element,
): IMulticastReplayLastSource<IRouteParams> {
  let $routeParams$: IMulticastReplayLastSource<IRouteParams> | undefined = COMPONENT_PARAMS.get(component);
  if ($routeParams$ === void 0) {
    $routeParams$ = createMulticastReplayLastSource<IRouteParams>();
    COMPONENT_PARAMS.set(component, $routeParams$);
  }
  return $routeParams$;
}

function setRouteParams(
  component: Element,
  params: IRouteParams,
): void {
  return getRouteParamsSource(component).emit(params);
}

export function getRouteParams(
  component: Element,
): IObservable<IRouteParams> {
  return getRouteParamsSource(component).subscribe;
}
