import { ICanActivateFunction } from './can-activate/can-activate-function.type';
import { ILoadRoutesListFunction } from './list/load-routes-list-function.type';

export interface IRoute<GExtra> {
  path: RegExp;
  canActivate: ICanActivateFunction;
  loadChildren: ILoadRoutesListFunction<GExtra>;
  extra: GExtra;
}
