import { createHTMLElementModifier, setReactiveEventListener, setReactiveProperty } from '@lirx/dom';
import { $$map, ISource } from '@lirx/core';

export function inputValueModifierFunction(
  element: HTMLElement,
  $source$: ISource<string>,
): HTMLElement {
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Not an input element`);
  }

  // setReactiveEventListener(() => {
  //   $source$.emit(element.value);
  // }, element, 'input');

  setReactiveEventListener($$map($source$.emit, () => element.value), element, 'input');
  setReactiveProperty($source$.subscribe, element, 'value');

  return element;
}


export const INPUT_VALUE_MODIFIER = createHTMLElementModifier('input-value', inputValueModifierFunction);


