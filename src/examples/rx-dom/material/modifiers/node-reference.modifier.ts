import { createHTMLElementModifier } from '@lirx/dom';
import { IObserver } from '@lirx/core';

export function nodeReferenceModifierFunction<GElement extends HTMLElement>(
  element: GElement,
  $destination: IObserver<GElement>,
): GElement {
  $destination(element);
  return element;
}


export const NODE_REFERENCE_MODIFIER = createHTMLElementModifier('ref', nodeReferenceModifierFunction);


