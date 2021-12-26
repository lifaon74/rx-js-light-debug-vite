import { IRouteParams } from '../route-params/route-params.type';

export interface IMatchingResolvedRoute<GExtra> {
  state: 'matching';
  params: IRouteParams;
  childRoute: IMatchingResolvedRoute<GExtra> | null;
  extra: GExtra;
}
