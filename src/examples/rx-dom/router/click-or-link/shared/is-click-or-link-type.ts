import { IClickOrLinkType } from './click-or-link-type.type';
import { isObject } from '../../../../../../../rx-js-light/dist';
import { isClickType } from '../click/is-click-type';
import { isLinkType } from '../link/is-link-type';

export function isClickOrLinkType(
  value: unknown,
): value is IClickOrLinkType {
  return isObject(value)
    && (
      isClickType(value as IClickOrLinkType)
      || isLinkType(value as IClickOrLinkType)
    );
}
