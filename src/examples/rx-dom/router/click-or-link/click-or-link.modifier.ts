import {
  createElementModifier, onNodeConnectedToWithImmediateCached, toObservableThrowIfUndefined,
} from '@lifaon/rx-dom';
import { fromEventTarget, IObservable, IUnsubscribe, noop } from '@lifaon/rx-js-light';
import { NAVIGATION } from '../navigation/navigation';
import { optionalClickOrLinkTypeToHREF } from './shared/optional/to/optional-click-or-link-type-to-href';
import { optionalClickOrLinkTypeToTarget } from './shared/optional/to/optional-click-or-link-type-to-target';
import { resolveOptionalClickOrLinkTypeOnClick } from './shared/optional/resolve-optional-click-or-link-type-on-click';
import { reflectOptionalClickOrLinkTypeOnHTMLAnchorElement } from './shared/optional/reflect-optional-click-or-link-type-on-html-anchor-element';
import { isClickType } from './click/is-click-type';
import { isLinkType } from './link/is-link-type';
import { IOptionalClickOrLinkType } from './shared/optional/optional-click-or-link-type.type';
import { resolveClickOrLinkTypeOnClick } from './shared/resolve-click-or-link-type-on-click';


function isHTMLAnchorElement(
  value: unknown,
): value is HTMLAnchorElement{
  return (value instanceof HTMLAnchorElement);
}


export function clickOrLinkModifierFunction<GElement extends HTMLElement>(
  element: GElement,
  clickOrLink: IObservable<IOptionalClickOrLinkType> | IOptionalClickOrLinkType,
): GElement {
  const clickOrLink$ = toObservableThrowIfUndefined(clickOrLink);

  const _isHTMLAnchorElement = isHTMLAnchorElement(element);
  const click$ = fromEventTarget<'click', MouseEvent>(element, 'click');

  let unsubscribeOfClickOrLink: IUnsubscribe = noop;
  let unsubscribeOfClick: IUnsubscribe = noop;

  onNodeConnectedToWithImmediateCached(element)((connected: boolean) => {
    if (connected) {
      unsubscribeOfClickOrLink = clickOrLink$((clickOrLink: IOptionalClickOrLinkType): void => {
        unsubscribeOfClick();

        if (_isHTMLAnchorElement) {
          reflectOptionalClickOrLinkTypeOnHTMLAnchorElement(clickOrLink, element);
        }

        if (clickOrLink !== void 0) {
          if (
            !_isHTMLAnchorElement
            || isClickType(clickOrLink)
            || (isLinkType(clickOrLink) && ((clickOrLink.replaceState === void 0) ? false : clickOrLink.replaceState))
          ) {
            unsubscribeOfClick = click$((event: MouseEvent): void => {
              resolveClickOrLinkTypeOnClick({
                event,
                clickOrLink,
                navigate: NAVIGATION.navigate,
              });
            });
          }
        }

      });
    } else {
      unsubscribeOfClickOrLink();
      unsubscribeOfClick();
    }
  });
  return element;
}


export const CLICK_OR_LINK_MODIFIER = createElementModifier('click-or-link', clickOrLinkModifierFunction);

