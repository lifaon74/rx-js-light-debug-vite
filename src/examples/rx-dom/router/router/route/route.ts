import { Path } from '../../path/path.class';
import { getDocumentBody, HTMLElementConstructor, nodeAppendChild, nodeRemove } from '@lifaon/rx-dom';
import { convertRoutePathToRegExp } from '../../path/convert/convert-route-path-to-reg-exp';
import { locateRouterOutletElement, ROUTER_OUTLET_TAG_NAME } from '../router-outlet/rx-router-outlet';
import { nodeRemoveChildren } from '../../../../../../../rx-dom/dist/src/light-dom/node/move/devired/batch/node-remove-children';
import {
  createNotAValidPathForThisRouteError, isNotAValidPathForThisRouteError
} from '../errors/not-a-valid-path-for-this-route-error/not-a-valid-path-for-this-route-error';
import { createRedirectToError } from '../errors/redirect-to-error/redirect-to-error';
import { IPathLike, toPath } from '../../path/to-path';
import {
  createMulticastReplayLastSource,
  IMulticastReplayLastSource, IReadonlyMulticastReplayLastSource, ISubscribeFunction, sourceToReadonlySource
} from '../../../../../../../rx-js-light/dist';

export type IRouterOutletElement = Element;
export type IOptionalRouterOutletElement = IRouterOutletElement | null;


/* RESOLVE */

export interface IRouteResolveFunction {
  (options: IRouteResolveOptions): Promise<IRouteResolveUndoFunction>;
}

export interface IRouteResolveOptions {
  path: Path;
  params: IRouteParams;
  injectParentComponent: IRouteResolveInjectParentComponentFunction,
  previousUndoFunction?: IRouteResolveUndoFunction;
}

export interface IRouteParams {
  readonly [key: string]: string;
}

export type IDynamicRouteParams = IMulticastReplayLastSource<IRouteParams>;
export type IReadonlyDynamicRouteParams = IReadonlyMulticastReplayLastSource<IRouteParams>;

export interface IRouteResolveInjectParentComponentFunction {
  (): Promise<IRouteResolveInjectParentComponentFunctionReturn>;
}

export interface IRouteResolveInjectParentComponentFunctionReturn {
  routerOutletElement: IOptionalRouterOutletElement;
  destroyParentComponent: IRouteResolveDestroyParentComponentFunction;
}

export interface IRouteResolveDestroyParentComponentFunction {
  (): void;
}


export function createDefaultInjectParentComponent(
  routerOutletElement: IRouterOutletElement = getDocumentBody(),
): IRouteResolveInjectParentComponentFunction {
  nodeRemoveChildren(routerOutletElement);
  return (): Promise<IRouteResolveInjectParentComponentFunctionReturn> => {
    return Promise.resolve({
      routerOutletElement,
      destroyParentComponent: () => {
      },
    });
  };
}


/*--*/

export interface IRouteResolveUndoFunction {
  (options: IRouteResolveUndoOptions): void;
}


export interface IRouteResolveUndoOptions {

}

// CHILDREN
export type IRouteChild = IRouteResolveFunction;
export type IRouteChildren = IRouteChild[];

export interface ILoadRouteChildrenFunction {
  (): Promise<IRouteChildren>;
}

export type IRouteChildrenOrLoadRouteChildrenFunction =
  IRouteChildren
  | ILoadRouteChildrenFunction
  ;

// COMPONENT
export type IRouteComponent = HTMLElementConstructor;

export interface ILoadRouteComponentFunction {
  (): Promise<IRouteComponent>;
}

export type IRouteComponentOrLoadRouteComponentFunction =
  IRouteComponent
  | ILoadRouteComponentFunction
  ;

// LOCATE ROUTER OUTLET
export interface ILocateRouterOutletFunction {
  (parentElement: Element): Promise<IRouterOutletElement>;
}

export const DEFAULT_LOCATE_ROUTER_OUTLET: ILocateRouterOutletFunction = (parentElement: Element): Promise<IRouterOutletElement> => {
  return locateRouterOutletElement(ROUTER_OUTLET_TAG_NAME, parentElement, new AbortController().signal); // TODO signal
};


// NAVIGATE TO

export type INavigateTo = Path | URL | string;


// CAN ACTIVATE

export type ICanActivateFunctionReturn = INavigateTo | true;

export interface ICanActivateFunction {
  (): Promise<ICanActivateFunctionReturn>;
}

export const DEFAULT_CAN_ACTIVATE_FUNCTION: ICanActivateFunction = () => Promise.resolve(true);

export function navigateTo(
  url: INavigateTo,
): ICanActivateFunction {
  return () => Promise.resolve(url);
}

// OPTIONS
export interface IRouteOptions {
  path: IPathLike;
  children?: IRouteChildrenOrLoadRouteChildrenFunction;
  canActivate?: ICanActivateFunction;
  component?: IRouteComponentOrLoadRouteComponentFunction;
  locateRouterOutletElement?: ILocateRouterOutletFunction;
  forceComponentReload?: boolean;
}


/* HELPERS */

function createLoadRouteChildrenFunction(
  children: IRouteChildrenOrLoadRouteChildrenFunction | undefined,
): ILoadRouteChildrenFunction {
  return (children === void 0)
    ? () => Promise.resolve<IRouteChildren>([])
    : (
      (typeof children === 'function')
        ? children
        : () => Promise.resolve<IRouteChildren>(children)
    );
}

function createLoadRouteComponentFunction(
  component: IRouteComponentOrLoadRouteComponentFunction | undefined,
): ILoadRouteComponentFunction {
  return (component === void 0)
    ? () => Promise.reject<IRouteComponent>(new Error(`Missing component`))
    : (
      (typeof component === 'function')
        ? component as ILoadRouteComponentFunction
        : () => Promise.resolve<IRouteComponent>(component)
    );
}

const OPTIMIZED_CREATE_AND_APPEND_COMPONENT_LIST = new WeakSet<Element>();
const COMPONENT_PARAMS = new WeakMap<Element, IDynamicRouteParams>();

function getComponentParams(
  element: Element,
): IDynamicRouteParams {
  if (COMPONENT_PARAMS.has(element)) {
    return COMPONENT_PARAMS.get(element) as IDynamicRouteParams;
  } else {
    throw new Error(`No params for this element`);
  }
}


export function getComponentReadonlyParams(
  element: Element,
): IReadonlyDynamicRouteParams {
  return sourceToReadonlySource(getComponentParams(element));

}


function createAndAppendComponent(
  routerOutletElement: Element,
  component: IRouteComponent,
  params: IRouteParams,
): Element {
  const $params$ = createMulticastReplayLastSource<IRouteParams>({ initialValue: params });
  const element: Element = new component(sourceToReadonlySource($params$));
  COMPONENT_PARAMS.set(element, $params$);
  return nodeAppendChild(routerOutletElement, element);
}

function optimizedCreateAndAppendComponent(
  routerOutletElement: Element,
  component: IRouteComponent,
  forceComponentReload: boolean,
  params: IRouteParams,
): Element {
  // return createAndAppendComponent(routerOutletElement, component);

  const routerOutletInjectedElement: Element | null = routerOutletElement.firstElementChild;
  if (routerOutletInjectedElement === null) {
    return createAndAppendComponent(routerOutletElement, component, params);
  } else {
    if ((routerOutletInjectedElement.constructor === component) && !forceComponentReload) {
      OPTIMIZED_CREATE_AND_APPEND_COMPONENT_LIST.add(routerOutletInjectedElement);
      getComponentParams(routerOutletInjectedElement).emit(params);
      return routerOutletInjectedElement;
    } else {
      if (routerOutletInjectedElement instanceof HTMLElement) {
        routerOutletInjectedElement.style.display = 'none';
      }/* else {
        nodeRemoveChildren(routerOutletElement);
      }*/
      return createAndAppendComponent(routerOutletElement, component, params);
    }
  }
}

function optimizedRemoveComponent(
  routerOutletElement: Element,
  element: Element,
): void {
  const routerOutletInjectedElement: Element | null = routerOutletElement.lastElementChild;
  if (routerOutletInjectedElement !== null) {
    if (
      (routerOutletInjectedElement !== element)
      || !OPTIMIZED_CREATE_AND_APPEND_COMPONENT_LIST.has(routerOutletInjectedElement)
    ) {
      nodeRemove(element);
    } else {
      OPTIMIZED_CREATE_AND_APPEND_COMPONENT_LIST.delete(routerOutletInjectedElement);
    }
  }
}

/* ROUTE */

export function createRouteResolver(
  {
    path: _path,
    children,
    canActivate = DEFAULT_CAN_ACTIVATE_FUNCTION,
    component,
    locateRouterOutletElement = DEFAULT_LOCATE_ROUTER_OUTLET,
    forceComponentReload = false,
  }: IRouteOptions,
): IRouteResolveFunction {
  const loadChildren: ILoadRouteChildrenFunction = createLoadRouteChildrenFunction(children);
  const loadComponent: ILoadRouteComponentFunction = createLoadRouteComponentFunction(component);
  const path: Path = toPath(_path);

  return async (
    {
      path: pathToResolve,
      params,
      injectParentComponent,
      previousUndoFunction,
    }: IRouteResolveOptions,
  ): Promise<IRouteResolveUndoFunction> => {
    const regExp: RegExp = convertRoutePathToRegExp(path);
    const match: RegExpExecArray | null = regExp.exec(pathToResolve.toString());

    if (match === null) {
      throw createNotAValidPathForThisRouteError();
    } else {
      const isRouteActivable: ICanActivateFunctionReturn = await canActivate();

      if (isRouteActivable !== true) {
        throw createRedirectToError({ url: isRouteActivable.toString() });
      }

      const remainingPath: Path = new Path(pathToResolve.toString().slice(match[0].length));
      // const segmentParams: IRouteParams = match.groups ?? {};
      const componentParams: IRouteParams = {
        ...params,
        ...match.groups,
      };

      const children: IRouteChildren = await loadChildren();
      const childrenLength: number = children.length;

      const injectParentComponentForChild: IRouteResolveInjectParentComponentFunction =
        async (): Promise<IRouteResolveInjectParentComponentFunctionReturn> => {
          const result: IRouteResolveInjectParentComponentFunctionReturn = await injectParentComponent();

          if (component === void 0) {
            return result;
          } else {

            const {
              routerOutletElement,
              destroyParentComponent,
            } = result;

            if (routerOutletElement === null) {
              throw new Error(`Expected a router outlet`);
            } else {
              const component: IRouteComponent = await loadComponent();
              const element: Element = optimizedCreateAndAppendComponent(
                routerOutletElement,
                component,
                forceComponentReload,
                componentParams,
              );
              return {
                routerOutletElement: (childrenLength === 0)
                  ? null
                  : await locateRouterOutletElement(element),
                destroyParentComponent: () => {
                  optimizedRemoveComponent(routerOutletElement, element);
                  destroyParentComponent();
                },
              };
            }
          }
        };


      if (childrenLength === 0) {
        if (remainingPath.toString() === '/') {
          const {
            destroyParentComponent,
          }: IRouteResolveInjectParentComponentFunctionReturn = await injectParentComponentForChild();

          if (previousUndoFunction !== void 0) {
            previousUndoFunction({});
          }

          return destroyParentComponent;
        } else {
          throw createNotAValidPathForThisRouteError();
        }
      } else {
        return createRoutesResolver(children)({
          path: remainingPath,
          params: componentParams,
          injectParentComponent: injectParentComponentForChild,
          previousUndoFunction,
        });
      }
    }
  };
}


export function createRoutesResolver(
  routes: IRouteResolveFunction[],
): IRouteResolveFunction {
  return (
    options: IRouteResolveOptions,
  ): Promise<IRouteResolveUndoFunction> => {
    return routes.reduce(
      (
        promise: Promise<IRouteResolveUndoFunction>,
        route: IRouteResolveFunction,
      ): Promise<IRouteResolveUndoFunction> => {
        return promise
          .catch((error: unknown): Promise<IRouteResolveUndoFunction> => {
            if (isNotAValidPathForThisRouteError(error)) {
              return route(options);
            } else {
              throw error;
            }
          });
      },
      Promise.reject<IRouteResolveUndoFunction>(createNotAValidPathForThisRouteError()),
    );
  };
}
