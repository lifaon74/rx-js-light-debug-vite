import { IClickOrLinkType } from '../shared/click-or-link-type.type';
import { ILinkType } from './link-type.type';

export function isLinkType(
  value: IClickOrLinkType,
): value is ILinkType {
  return (value.type === 'link');
}
