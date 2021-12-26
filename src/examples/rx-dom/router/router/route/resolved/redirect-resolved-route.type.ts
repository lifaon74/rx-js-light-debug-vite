import { INavigateTo } from '../navigate-to/navigate-to.type';

export interface IRedirectResolvedRoute {
  state: 'redirect';
  to: INavigateTo;
}
