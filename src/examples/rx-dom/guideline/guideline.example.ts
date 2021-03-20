import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, generateCreateElementFunctionWithCustomElements, OnCreate
} from '@lifaon/rx-dom';
import { AppProgressBarComponent } from '../progress-bar/progress-bar.component';
import { AppProgressRingComponent } from '../progress-ring/progress-ring.component';
import {
  conditionalSubscribePipe, createMulticastReplayLastSource, distinctSubscribePipe, fromEventTarget, interval,
  ISubscribeFunction, mapSubscribePipe, of, pipeSubscribeFunction, reactiveFunction, shareSubscribePipe
} from '@lifaon/rx-js-light';

export const APP_GUIDELINE_CUSTOM_ELEMENTS = [
  AppProgressBarComponent,
  AppProgressRingComponent
];


export function commonPitfallExample() {

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

    const refreshIsFormValid = () => {
      isFormValid = (inputA.value.length < 10)
        && (inputB.value.length < 10);
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
    // and maps the result to return true if the form is valid
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
      ]),[
        distinctSubscribePipe<boolean>(), // let's emit only distinct values
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

    inputAValue(() => {
      console.log('inputA changed');
      // do some actions #1
    });

    inputBValue(() => {
      console.log('inputB changed');
      // do some actions #2
    });

    isFormValid((valid: boolean) => {
      stateText.innerText = valid ? 'valid' : 'invalid';
    });

    formSubmitValid(() => {
      console.log('valid');
      // do some actions #3
    });
  }

  // withoutObservable();
  withObservable();

}


/** COMPONENT **/

interface IData {
  progress: ISubscribeFunction<number>;
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  of,
  createElement: generateCreateElementFunctionWithCustomElements(APP_GUIDELINE_CUSTOM_ELEMENTS)
};

/*
      progress="0.75"
      radius="60"
      stroke="20"

      [progress]="of(0.75)"
      [radius]="of(60)"
      [stroke]="of(20)"
 */

@Component({
  name: 'app-guideline',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <app-progress-bar
      [progress]="$.progress"
    ></app-progress-bar>
    <app-progress-ring
      [progress]="$.progress"
      radius="60"
      stroke="20"
    ></app-progress-ring>
  `, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(`
    :host {
      display: block;
    }
  `),
})
class AppGuideLineComponent extends HTMLElement implements OnCreate<IData> {
  protected readonly data: IData;

  constructor() {
    super();
    let _progress: number = 0;

    const progress = pipeSubscribeFunction(interval(100), [
      mapSubscribePipe(() => (_progress = (_progress + Math.random() * 0.01) % 1))
    ]);

    this.data = {
      progress,
    };
  }

  public onCreate(): IData {
    return this.data;
  }
}

/** BOOTSTRAP FUNCTION **/

export function guidelineExample() {
  // bootstrap(new AppGuideLineComponent());
  commonPitfallExample();
}
