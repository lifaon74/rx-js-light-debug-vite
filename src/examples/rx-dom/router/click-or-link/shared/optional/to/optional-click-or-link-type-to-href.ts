import { clickOrLinkTypeToHREF } from '../../to/click-or-link-type-to-href';
import { IOptionalClickOrLinkType } from '../optional-click-or-link-type.type';

export function optionalClickOrLinkTypeToHREF(
  value: IOptionalClickOrLinkType,
): string {
  return (value === void 0)
    ? ''
    : clickOrLinkTypeToHREF(value);
}
