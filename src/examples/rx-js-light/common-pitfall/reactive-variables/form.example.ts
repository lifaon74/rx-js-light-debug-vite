import {
  conditionalObservablePipe, createMulticastReplayLastSource, distinctObservablePipe, fromEventTarget, function$$,
  let$$,
  map$$, map$$$,
  mapObservablePipe, pipe$$,
  pipeObservable, reactiveFunction, share$$, share$$$, shareObservablePipe
} from '@lirx/core';

/** FORM EXAMPLE **/

function withoutObservable() {
  const form = document.createElement('form');
  document.body.appendChild(form);

  const inputA = document.createElement('input');
  form.appendChild(inputA);

  const inputB = document.createElement('input');
  form.appendChild(inputB);

  const stateText = document.createElement('div');
  form.appendChild(stateText);

  const button = document.createElement('button');
  button.innerText = 'submit';
  form.appendChild(button);

  let isFormValid: boolean = false;

  const getIsFormValid = () => {
    return (inputA.value.length < 10)
      && (inputB.value.length < 10);
  };

  const refreshIsFormValid = () => {
    isFormValid = getIsFormValid();
    stateText.innerText = isFormValid ? 'valid' : 'invalid';
  };

  inputA.oninput = () => {
    console.log('inputA changed');
    // do some actions #1
    refreshIsFormValid();
  };

  inputB.oninput = () => {
    console.log('inputB changed');
    // do some actions #2
    // OOPS, we forgot refreshIsFormValid();
  };

  form.onsubmit = (event: Event) => {
    event.preventDefault();
    // OOPS, potentially incorrect:
    // if none of the input have been touched, isFormValid is false
    // because we forgot refreshIsFormValid when inputB changed, isFormValid is into an invalid state
    if (isFormValid) {
      console.log('valid');
      // do some actions #3
    }
  };


}

function withObservable() {
  /** CREATE SOME ELEMENTS **/

  const form = document.createElement('form');
  document.body.appendChild(form);

  const inputA = document.createElement('input');
  form.appendChild(inputA);

  const inputB = document.createElement('input');
  form.appendChild(inputB);

  const stateText = document.createElement('div');
  form.appendChild(stateText);

  const button = document.createElement('button');
  button.innerText = 'submit';
  form.appendChild(button);

  /** CREATE OUR REACTIVE VARIABLES **/

    // creates an observable which reflects the value of inputA
  const inputAValue = pipeObservable(fromEventTarget(inputA, 'input'), [ // creates an observable from an event
      mapObservablePipe<Event, string>(() => inputA.value), // maps the event to return the input value
      shareObservablePipe<string>( // shares the observable
        () => createMulticastReplayLastSource<string>(inputA.value) // initial observable value
      ),
    ]);

  // creates an observable which reflects the value of inputB
  const inputBValue = pipeObservable(fromEventTarget(inputB, 'input'), [
    mapObservablePipe<Event, string>(() => inputB.value),
    shareObservablePipe<string>(() => createMulticastReplayLastSource<string>(inputB.value)),
  ]);

  // creates a reactive function with listen to inputAValue and inputBValue,
  // and maps the result (returns true if the form is valid)
  const isFormValid = pipeObservable(
    reactiveFunction([
      inputAValue,
      inputBValue,
    ], (
      inputAValue: string,
      inputBValue: string,
    ): boolean => {
      return (inputAValue.length < 10)
        && (inputBValue.length < 10);
    }), [
      distinctObservablePipe<boolean>(), // let's emit only distinct values, for better efficiency
      shareObservablePipe<boolean>(),
    ]);

  // creates a shared observable which emits an Event when the form is submitted
  const formSubmit = pipeObservable(fromEventTarget(form, 'submit'), [
    shareObservablePipe<Event>(),
  ]);

  // subscribes to formSubmit to prevent form submit
  formSubmit((event: Event) => event.preventDefault());

  // creates an observable which triggers when the form is submitted and is valid
  const formSubmitValid = pipeObservable(formSubmit, [
    conditionalObservablePipe(isFormValid), // pipe which subscribes to formSubmit if isFormValid is true
  ]);

  // creates an observable that outputs the value to display into 'stateText'
  const stateTextValue = pipeObservable(isFormValid, [
    mapObservablePipe((valid: boolean) => {
      return valid ? 'valid' : 'invalid';
    })
  ]);

  inputAValue(() => {
    console.log('inputA changed');
    // do some actions #1
  });

  inputBValue(() => {
    console.log('inputB changed');
    // do some actions #2
  });

  stateTextValue((value: string) => {
    stateText.innerText = value;
  });

  formSubmitValid(() => {
    console.log('valid');
    // do some actions #3
  });
}


function withObservableAndShortcuts() {

  /** CREATE SOME ELEMENTS **/

  const form = document.createElement('form');
  document.body.appendChild(form);

  const inputA = document.createElement('input');
  form.appendChild(inputA);

  const inputB = document.createElement('input');
  form.appendChild(inputB);

  const stateText = document.createElement('div');
  form.appendChild(stateText);

  const button = document.createElement('button');
  button.innerText = 'submit';
  form.appendChild(button);

  /** CREATE OUR REACTIVE VARIABLES **/

    // creates an observable which reflects the value of inputA
  const inputAValue = pipe$$(fromEventTarget(inputA, 'input'), [ // creates an observable from an event
      map$$$<Event, string>(() => inputA.value), // maps the event to return the input value
      share$$$<string>( // shares the observable
        () => let$$<string>(inputA.value) // initial observable value
      ),
    ]);

  // creates an observable which reflects the value of inputB
  const inputBValue = pipe$$(fromEventTarget(inputB, 'input'), [
    map$$$<Event, string>(() => inputB.value),
    share$$$<string>(() => let$$<string>(inputB.value)),
  ]);

  // creates a reactive function with listen to inputAValue and inputBValue,
  // and maps the result (returns true if the form is valid)
  const isFormValid = function$$([
    inputAValue,
    inputBValue,
  ], (
    inputAValue: string,
    inputBValue: string,
  ): boolean => {
    return (inputAValue.length < 10)
      && (inputBValue.length < 10);
  });

  // creates a shared observable which emits an Event when the form is submitted
  const formSubmit = share$$(fromEventTarget(form, 'submit'));

  // subscribes to formSubmit to prevent form submit
  formSubmit((event: Event) => event.preventDefault());

  // creates an observable which triggers when the form is submitted and is valid
  const formSubmitValid = pipe$$(formSubmit, [
    conditionalObservablePipe(isFormValid), // pipe which subscribes to formSubmit if isFormValid is true
  ]);

  // creates an observable that outputs the value to display into 'stateText'
  const stateTextValue = map$$(isFormValid, (valid: boolean) => {
    return valid ? 'valid' : 'invalid';
  });

  inputAValue(() => {
    console.log('inputA changed');
    // do some actions #1
  });

  inputBValue(() => {
    console.log('inputB changed');
    // do some actions #2
  });

  stateTextValue((value: string) => {
    stateText.innerText = value;
  });

  formSubmitValid(() => {
    console.log('valid');
    // do some actions #3
  });
}

/*-------------*/

export function reactiveVariableFormExample() {
  // withoutObservable();
  // withObservable();
  withObservableAndShortcuts();
}
