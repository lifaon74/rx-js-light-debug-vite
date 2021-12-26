import { IMatchingResolvedRoute } from './matching-resolved-route.type';
import { INotMatchingResolvedRoute } from './not-matching-resolved-route.type';
import { IRedirectResolvedRoute } from './redirect-resolved-route.type';

export type IResolvedRoute<GExtra> =
  | IMatchingResolvedRoute<GExtra>
  | INotMatchingResolvedRoute
  | IRedirectResolvedRoute
  ;
