import { isClickOrLinkType } from '../is-click-or-link-type';
import { IOptionalClickOrLinkType } from './optional-click-or-link-type.type';

export function isOptionalClickOrLinkType(
  value: unknown,
): value is IOptionalClickOrLinkType {
  return (value === void 0)
    || isClickOrLinkType(value);
}
