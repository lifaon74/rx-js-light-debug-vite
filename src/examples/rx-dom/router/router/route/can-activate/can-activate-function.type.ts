import { IRouteParams } from '../route-params/route-params.type';
import { INavigateTo } from '../navigate-to/navigate-to.type';
import { IDefaultNotificationsUnion, IObservable } from '@lifaon/rx-js-light';

export type ICanActivateFunctionReturnedValue = INavigateTo | true;

export type ICanActivateFunctionReturnedObservableValue = IDefaultNotificationsUnion<ICanActivateFunctionReturnedValue>;

export type ICanActivateFunctionReturn = IObservable<ICanActivateFunctionReturnedObservableValue>;

export interface ICanActivateFunction {
  (
    params: IRouteParams,
  ): ICanActivateFunctionReturn;
}
