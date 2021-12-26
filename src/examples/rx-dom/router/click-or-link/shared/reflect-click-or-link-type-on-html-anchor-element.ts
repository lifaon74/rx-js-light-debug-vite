import { IClickOrLinkType } from './click-or-link-type.type';
import { clickOrLinkTypeToHREF } from './to/click-or-link-type-to-href';
import { clickOrLinkTypeToTarget } from './to/click-or-link-type-to-target';
import { clickOrLinkTypeToRel } from './to/click-or-link-type-to-rel';

export function reflectClickOrLinkTypeOnHTMLAnchorElement(
  clickOrLink: IClickOrLinkType,
  element: HTMLAnchorElement,
): void {
  element.href = clickOrLinkTypeToHREF(clickOrLink);
  element.target = clickOrLinkTypeToTarget(clickOrLink);
  element.rel = clickOrLinkTypeToRel(clickOrLink);
}
