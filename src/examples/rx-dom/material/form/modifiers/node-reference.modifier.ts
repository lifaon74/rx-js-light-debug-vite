import { createElementModifier } from '@lifaon/rx-dom';
import { IObserver } from '@lifaon/rx-js-light';

export function nodeReferenceModifierFunction<GElement extends HTMLElement>(
  element: GElement,
  $destination: IObserver<GElement>,
): GElement {
  $destination(element);
  return element;
}


export const NODE_REFERENCE_MODIFIER = createElementModifier('ref', nodeReferenceModifierFunction);


