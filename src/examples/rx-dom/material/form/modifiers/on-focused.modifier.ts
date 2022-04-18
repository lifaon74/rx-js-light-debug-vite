import { createHTMLElementModifier, subscribeOnNodeConnectedTo } from '@lirx/dom';
import { IObserver } from '@lirx/core';
import { isElementOrChildrenFocusedObservableDebounced } from '../../helpers/focus-subscribe-function';

export function onFocusedModifierFunction(
  element: HTMLElement,
  $focused: IObserver<boolean>,
): HTMLElement {
  subscribeOnNodeConnectedTo(element, isElementOrChildrenFocusedObservableDebounced(element), $focused);
  return element;
}


export const ON_FOCUSED_MODIFIER = createHTMLElementModifier('on-focused', onFocusedModifierFunction);


