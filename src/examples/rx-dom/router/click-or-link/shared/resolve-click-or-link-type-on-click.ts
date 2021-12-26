import { IClickOrLinkType } from './click-or-link-type.type';
import { INavigationNavigateFunction, NAVIGATION } from '../../navigation/navigation';
import { isClickType } from '../click/is-click-type';

export interface IResolveClickOrLinkTypeOnClickOptions {
  clickOrLink: IClickOrLinkType;
  event: MouseEvent;
  navigate?: INavigationNavigateFunction;
}

export function resolveClickOrLinkTypeOnClick(
  {
    clickOrLink,
    event,
    navigate = NAVIGATION.navigate,
  }: IResolveClickOrLinkTypeOnClickOptions,
): void {
  const {
    preventDefault = true,
    stopPropagation = true,
    stopImmediatePropagation = true,
  } = clickOrLink;

  if (preventDefault) {
    event.preventDefault();
  }

  if (stopPropagation) {
    event.stopPropagation();
  }

  if (stopImmediatePropagation) {
    event.stopImmediatePropagation();
  }

  if (isClickType(clickOrLink)) {
    clickOrLink.onClick(event);
  } else {
    if (
      (event.button === 1)
      || (
        (event.button === 0)
        && event.ctrlKey
      )
    ) {
      clickOrLink = {
        ...clickOrLink,
        target: '_blank',
      };
    }
    navigate(clickOrLink.url, clickOrLink);
  }
}
