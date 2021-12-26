import { IRoutesList } from './routes-list.type';
import { IDefaultNotificationsUnion, IObservable } from '@lifaon/rx-js-light';

export type ILoadRoutesListFunctionReturnedObservableValue<GExtra> = IDefaultNotificationsUnion<IRoutesList<GExtra>>;
export type ILoadRoutesListFunctionReturn<GExtra> = IObservable<ILoadRoutesListFunctionReturnedObservableValue<GExtra>>;

export interface ILoadRoutesListFunction<GExtra> {
  (): ILoadRoutesListFunctionReturn<GExtra>;
}
