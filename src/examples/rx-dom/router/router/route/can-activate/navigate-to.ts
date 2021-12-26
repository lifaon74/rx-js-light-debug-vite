import { INavigateTo } from '../navigate-to/navigate-to.type';
import { ICanActivateFunction } from './can-activate-function.type';
import { singleN } from '@lifaon/rx-js-light';

export function navigateTo(
  url: INavigateTo,
): ICanActivateFunction {
  const url$ = singleN(url);
  return () => url$;
}
