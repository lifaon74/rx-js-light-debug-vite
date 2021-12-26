import { INavigationNavigateFunction } from '../../../navigation/navigation';
import { IOptionalClickOrLinkType } from './optional-click-or-link-type.type';
import {
  IResolveClickOrLinkTypeOnClickOptions, resolveClickOrLinkTypeOnClick,
} from '../resolve-click-or-link-type-on-click';

export interface IResolveOptionalClickOrLinkTypeOnClickOptions {
  clickOrLink: IOptionalClickOrLinkType;
  event: MouseEvent;
  navigate?: INavigationNavigateFunction;
}

export function resolveOptionalClickOrLinkTypeOnClick(
  options: IResolveOptionalClickOrLinkTypeOnClickOptions,
): void {
  if (options.clickOrLink !== void 0) {
    resolveClickOrLinkTypeOnClick(options as IResolveClickOrLinkTypeOnClickOptions);
  }
}


