import { INavigation, NAVIGATION } from '../../../navigation/navigation';
import { IInjectedRXRoutes, IResolvedRXRoutes, IRXRoute } from './rx-route.type';
import { Path } from '../../../path/path.class';
import { getLocation } from '../../../navigation/get-location';
import { getBaseURI } from '../../../navigation/get-base-uri';
import {
  abortSignalPromiseBranching, createAbortControllerFromAbortSignals, createTimeout, IAbortTimer, isAbortError, noop,
  wrapFunctionWithAbortSignalAndThrow
} from '../../../../../../../../rx-js-light/dist';
import { resolveRXRoute } from './resolve-rx-route';
import { injectRXRoute } from './inject-rx-route';
import { getDocument } from '../../../../../../../../rx-dom/dist';
import { createRXDOMRouterError } from '../../router/errors/rx-dom-router-error/create-rx-dom-router-error';

export interface IRXRouterUpdateOptions {
  signal?: AbortSignal;
  timeout?: number;
}

export type IRXRouterOptionsOnError = (error: any) => void;

export interface IRXRouterOptions {
  timeout?: number;
  onError?: IRXRouterOptionsOnError;
}

export function DEFAULT_RX_ROUTER_ON_ERROR_FUNCTION(error: any) {
  throw error;
}

export class RXRouter {
  public readonly navigation: INavigation;
  public readonly routes: ArrayLike<IRXRoute>;
  protected _timeout: number;
  protected _onError: IRXRouterOptionsOnError;
  protected _resolvedRoutes: IInjectedRXRoutes;
  protected _updateController: AbortController | undefined;


  constructor(
    routes: ArrayLike<IRXRoute>,
    {
      timeout = 20000,
      onError = DEFAULT_RX_ROUTER_ON_ERROR_FUNCTION,
    }: IRXRouterOptions = {},
  ) {
    this.navigation = NAVIGATION;
    this.routes = routes;
    this._timeout = timeout;
    this._onError = onError;
    this._resolvedRoutes = [];

    this.navigation.onChange(() => {
      this.refreshAndCatch();
    });
  }

  get resolvedRoutes(): IInjectedRXRoutes {
    return this._resolvedRoutes;
  }

  getCurrentPath(): Path {
    const currentPathName: string = getLocation().pathname;
    const baseURIPathName: string = new URL(getBaseURI()).pathname;
    // getLocation().pathname.replace(new URL(getBaseURI()).pathname, '')
    return new Path(
      currentPathName.startsWith(baseURIPathName)
        ? currentPathName.slice(baseURIPathName.length)
        : currentPathName,
    );
  }

  refreshAndCatch(
    options?: IRXRouterUpdateOptions,
  ): Promise<void> {
    return this.refresh(options)
      .then(noop, (error: any) => {
        if (!isAbortError(error)) {
          this._onError(error);
        }
      });
  }

  refresh(
    options?: IRXRouterUpdateOptions,
  ): Promise<IInjectedRXRoutes> {
    return this.update(this.getCurrentPath(), options);
  }

  update(
    path: Path,
    {
      signal,
      timeout = this._timeout,
    }: IRXRouterUpdateOptions = {},
  ): Promise<IInjectedRXRoutes> {
    if (this._updateController !== void 0) {
      this._updateController.abort();
    }

    const controller: AbortController = (signal === void 0)
      ? new AbortController()
      : createAbortControllerFromAbortSignals([signal]);
    this._updateController = controller;

    const _signal: AbortSignal = this._updateController.signal;
    const resolvedRoutes: IResolvedRXRoutes = resolveRXRoute(this.routes, path);

    return abortSignalPromiseBranching(_signal, (signal: AbortSignal) => {
      let unsubscribeTimeout: IAbortTimer;

      const timeoutPromise: Promise<never> = new Promise<never>((resolve: any, reject: any) => {
        unsubscribeTimeout = createTimeout(() => {
          reject(createRXDOMRouterError(2, `Router timeout: not able to resolve the route '${ path.toString() }'`));
          controller.abort();
        }, timeout);
      });

      const injectPromise: Promise<IInjectedRXRoutes> = injectRXRoute(resolvedRoutes, this._resolvedRoutes, getDocument(), signal)
        .then(wrapFunctionWithAbortSignalAndThrow((resolvedRoutes: IInjectedRXRoutes): IInjectedRXRoutes => {
          this._resolvedRoutes = resolvedRoutes;
          return resolvedRoutes;
        }, signal));

      return Promise.race([
        timeoutPromise,
        injectPromise,
      ])
        .finally(() => {
          unsubscribeTimeout();
        });
    });
  }

  // update(
  //   path: Path,
  //   signal?: AbortSignal,
  // ): Promise<void> {
  //   if (this._updateController !== void 0) {
  //     this._updateController.abort();
  //   }
  //
  //   this._updateController = (signal === void 0)
  //     ? new AbortController()
  //     : createAbortControllerFromAbortSignals([signal]);
  //
  //   const _signal: AbortSignal = this._updateController.signal;
  //
  //   const resolvedRoutes: IResolvedRXRoutes = resolveRXRoute(this.routes, path);
  //
  //   // console.log(resolveRXRoute(this.routes, path));
  //   return makeResolvedRXRoutesSync(resolveRXRoute(this.routes, path), _signal)
  //     .then(wrapFunctionWithAbortSignalAndThrow((resolvedRoutes: IResolvedRXRoutesSync) => {
  //       // console.log('inject', resolvedRoutes);
  //       const previousResolvedRoutes: IResolvedRXRoutesSync = this._resolvedRoutes;
  //       this._resolvedRoutes = resolvedRoutes;
  //       injectRXRoute(resolvedRoutes, previousResolvedRoutes);
  //     }, _signal));
  // }
}
