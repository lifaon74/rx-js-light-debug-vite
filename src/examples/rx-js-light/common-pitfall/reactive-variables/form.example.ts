import {
  conditionalSubscribePipe, createMulticastReplayLastSource, distinctSubscribePipe, fromEventTarget, mapSubscribePipe,
  pipeSubscribeFunction, reactiveFunction, shareSubscribePipe
} from '@lifaon/rx-js-light';

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
  const inputAValue = pipeSubscribeFunction(fromEventTarget(inputA, 'input'), [ // creates an observable from an event
      mapSubscribePipe<Event, string>(() => inputA.value), // maps the event to return the input value
      shareSubscribePipe<string>( // shares the observable
        () => createMulticastReplayLastSource<string>({ initialValue: inputA.value }) // initial observable value
      ),
    ]);

  // creates an observable which reflects the value of inputB
  const inputBValue = pipeSubscribeFunction(fromEventTarget(inputB, 'input'), [
    mapSubscribePipe<Event, string>(() => inputB.value),
    shareSubscribePipe<string>(() => createMulticastReplayLastSource<string>({ initialValue: inputB.value })),
  ]);

  // creates a reactive function with listen to inputAValue and inputBValue,
  // and maps the result (returns true if the form is valid)
  const isFormValid = pipeSubscribeFunction(
    reactiveFunction((
      inputAValue: string,
      inputBValue: string,
    ): boolean => {
      return (inputAValue.length < 10)
        && (inputBValue.length < 10);
    }, [
      inputAValue,
      inputBValue,
    ]), [
      distinctSubscribePipe<boolean>(), // let's emit only distinct values, for better efficiency
      shareSubscribePipe<boolean>(),
    ]);

  // creates a shared observable which emits an Event when the form is submitted
  const formSubmit = pipeSubscribeFunction(fromEventTarget(form, 'submit'), [
    shareSubscribePipe<Event>(),
  ]);

  // subscribes to formSubmit to prevent form submit
  formSubmit((event: Event) => event.preventDefault());

  // creates an observable which triggers when the form is submitted and is valid
  const formSubmitValid = pipeSubscribeFunction(formSubmit, [
    conditionalSubscribePipe(isFormValid), // pipe which subscribes to formSubmit if isFormValid is true
  ]);

  // creates an observable that outputs the value to display into 'stateText'
  const stateTextValue = pipeSubscribeFunction(isFormValid, [
    mapSubscribePipe((valid: boolean) => {
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

/*-------------*/

export function reactiveVariableFormExample() {
  // withoutObservable();
  withObservable();
}
