import { createElementModifier, setReactiveEventListener, setReactiveProperty } from '@lifaon/rx-dom';
import { ISource } from '@lifaon/rx-js-light';

export function inputValueModifierFunction(
  element: HTMLElement,
  $source$: ISource<string>,
): HTMLElement {
  if (!(element instanceof HTMLInputElement)) {
    throw new Error(`Not an input element`);
  }

  setReactiveEventListener(() => {
    $source$.emit(element.value);
  }, element, 'input');


  setReactiveProperty($source$.subscribe, element, 'value');

  return element;
}


export const INPUT_VALUE_MODIFIER = createElementModifier('input-value', inputValueModifierFunction);


