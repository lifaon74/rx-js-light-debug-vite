import { IObservable, single } from '@lirx/core';
import {
  createDocumentFragmentFilledWithNodes, IReactiveContent, querySelectorOrThrow,
} from '@lirx/dom';

/**
 * TODO make available in lirx/dom ?
 */
export function getElementChildAsReactiveContentObservable(
  element: ParentNode,
  selector: string,
): IObservable<IReactiveContent> {
  return single(createDocumentFragmentFilledWithNodes([querySelectorOrThrow(element, selector)]));
  // return single(createDocumentFragmentFilledWithNodes(Array.from(querySelectorOrThrow(element, selector).childNodes)));
}
