import { optionalClickOrLinkTypeToHREF } from './to/optional-click-or-link-type-to-href';
import { optionalClickOrLinkTypeToTarget } from './to/optional-click-or-link-type-to-target';
import { optionalClickOrLinkTypeToRel } from './to/optional-click-or-link-type-to-rel';
import { IOptionalClickOrLinkType } from './optional-click-or-link-type.type';

export function reflectOptionalClickOrLinkTypeOnHTMLAnchorElement(
  clickOrLink: IOptionalClickOrLinkType,
  element: HTMLAnchorElement,
): void {
  element.href = optionalClickOrLinkTypeToHREF(clickOrLink);
  element.target = optionalClickOrLinkTypeToTarget(clickOrLink);
  element.rel = optionalClickOrLinkTypeToRel(clickOrLink);
}

