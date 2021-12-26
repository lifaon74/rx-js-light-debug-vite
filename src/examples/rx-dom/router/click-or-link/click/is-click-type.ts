import { IClickOrLinkType } from '../shared/click-or-link-type.type';
import { IClickType } from './click-type.type';


export function isClickType(
  value: IClickOrLinkType,
): value is IClickType {
  return (value.type === 'click');
}
