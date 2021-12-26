import { clickOrLinkTypeToTarget } from '../../to/click-or-link-type-to-target';
import { IOptionalClickOrLinkType } from '../optional-click-or-link-type.type';

export function optionalClickOrLinkTypeToTarget(
  value: IOptionalClickOrLinkType,
): string {
  return (value === void 0)
    ? ''
    : clickOrLinkTypeToTarget(value);
}
