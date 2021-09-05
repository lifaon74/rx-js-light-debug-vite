import { createElementModifier, subscribeOnNodeConnectedTo } from '@lifaon/rx-dom';
import { IEmitFunction } from '@lifaon/rx-js-light';
import { isElementOrChildrenFocusedSubscribeFunctionDebounced } from '../../helpers/focus-subscribe-function';

export function onFocusedModifierFunction(
  element: HTMLElement,
  focused$: IEmitFunction<boolean>,
): HTMLElement {
  subscribeOnNodeConnectedTo(element, isElementOrChildrenFocusedSubscribeFunctionDebounced(element), focused$);
  return element;
}


export const ON_FOCUSED_MODIFIER = createElementModifier('on-focused', onFocusedModifierFunction);


