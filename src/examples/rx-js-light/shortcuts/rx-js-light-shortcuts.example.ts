import { andM$$, let$$, map$$, share$$, single } from '@lifaon/rx-js-light';


function rxjsLightShortcutsExample1() {
  const $inputA$ = let$$('abc');
  const $inputB$ = let$$('def');
  const $inputC$ = let$$('');

  const isInputAValid$ = map$$($inputA$.subscribe, (value: string) => (value.length >= 10));
  const isInputBValid$ = map$$($inputB$.subscribe, (value: string) => (value.length <= 10));
  const isInputCValid$ = single(true); // let's assume that inputC is always valid

  const isFormValid$ = andM$$(isInputAValid$, isInputBValid$, isInputCValid$);

  // EQUIVALENT
  // const isFormValid$ = function$$(
  //   [isInputAValid$, isInputBValid$, isInputCValid$],
  //   (isInputCValid, isInputBValid, isInputCValid) => {
  //   return isInputCValid && isInputBValid && isInputCValid;
  // });

  const isFormValidText$ = share$$(map$$(isFormValid$, (valid: boolean) => `Form is ${ valid ? 'valid' : 'invalid' }`));

  isFormValidText$(console.log.bind(console));

  /*--*/

  const createAndAppendElement = <K extends keyof HTMLElementTagNameMap>(tagName: K) => document.body.appendChild(document.createElement(tagName));

  const inputA = createAndAppendElement('input');
  inputA.oninput = () => $inputA$.emit(inputA.value);

  const inputB = createAndAppendElement('input');
  inputB.oninput = () => $inputB$.emit(inputB.value);

  const inputC = createAndAppendElement('input');
  inputC.oninput = () => $inputC$.emit(inputC.value);

  const validityContainer = createAndAppendElement('div');
  isFormValidText$((text: string) => {
    validityContainer.innerText = text;
  });
}

/*-----*/

export function rxjsLightShortcutsExample() {
  rxjsLightShortcutsExample1();
}
