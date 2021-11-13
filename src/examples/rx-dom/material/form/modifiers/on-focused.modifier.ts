import { createElementModifier, subscribeOnNodeConnectedTo } from '@lifaon/rx-dom';
import { IObserver } from '@lifaon/rx-js-light';
import { isElementOrChildrenFocusedObservableDebounced } from '../../helpers/focus-subscribe-function';

export function onFocusedModifierFunction(
  element: HTMLElement,
  focused$: IObserver<boolean>,
): HTMLElement {
  subscribeOnNodeConnectedTo(element, isElementOrChildrenFocusedObservableDebounced(element), focused$);
  return element;
}


export const ON_FOCUSED_MODIFIER = createElementModifier('on-focused', onFocusedModifierFunction);


