import { clickOrLinkTypeToRel } from '../../to/click-or-link-type-to-rel';
import { IOptionalClickOrLinkType } from '../optional-click-or-link-type.type';

export function optionalClickOrLinkTypeToRel(
  value: IOptionalClickOrLinkType,
): string {
  return (value === void 0)
    ? ''
    : clickOrLinkTypeToRel(value);
}
