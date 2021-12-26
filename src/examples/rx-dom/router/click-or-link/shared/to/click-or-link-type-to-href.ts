import { IClickOrLinkType } from '../click-or-link-type.type';
import { isClickType } from '../../click/is-click-type';
import { clickToHREF } from '../../click/to/click-to-href';
import { linkToHREF } from '../../link/to/link-to-href';

export function clickOrLinkTypeToHREF(
  value: IClickOrLinkType,
): string {
  return isClickType(value)
    ? clickToHREF(value)
    : linkToHREF(value);
}
