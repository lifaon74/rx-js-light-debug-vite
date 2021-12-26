import { IClickOrLinkType } from '../click-or-link-type.type';
import { isClickType } from '../../click/is-click-type';
import { clickToRel } from '../../click/to/click-to-rel';
import { linkToRel } from '../../link/to/link-to-rel';

export function clickOrLinkTypeToRel(
  value: IClickOrLinkType,
): string {
  return isClickType(value)
    ? clickToRel(value)
    : linkToRel(value);
}
