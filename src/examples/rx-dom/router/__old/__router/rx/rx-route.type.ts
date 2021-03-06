import { HTMLElementConstructor } from '../../../../../../../../rx-dom/dist';
import { IRoute } from '../route/route.type';
import { Path } from '../../../path/path.class';

export type ICanActivateFunctionReturn = void | Path;

export interface ICanActivateFunction {
  (): (Promise<ICanActivateFunctionReturn> | ICanActivateFunctionReturn);
}

/*-----*/


export type IRXRouteComponent = HTMLElementConstructor;

export interface IRXRouteExtra {
  component?: IRXRouteComponent;
  routerOutletSelector?: string;
  canActivate?: ICanActivateFunction;
}

export type ILazyRXRouteExtra = (signal: AbortSignal) => Promise<IRXRouteExtra>;

export type IRXRouteExtraProp = ILazyRXRouteExtra | IRXRouteExtra;

export type IRXRoute = IRoute<IRXRouteExtraProp>;

export interface IResolvedRXExtraProperties {
  params?: IResolvedRXRouteParams;
}

export interface IResolvedRXRoute extends IResolvedRXExtraProperties, IRXRoute {
}

export interface IResolvedRXRouteParams {
  [key: string]: string;
}

export type IResolvedRXRoutes = readonly IResolvedRXRoute[];

/* INJECTED */

export interface IInjectedRXRoute {
  route: IResolvedRXRoute,
  extra: IRXRouteExtra;
  routerOutletElement: HTMLElement | null;
}

export type IInjectedRXRoutes = readonly IInjectedRXRoute[];
