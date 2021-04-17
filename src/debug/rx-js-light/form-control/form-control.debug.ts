import {
  bootstrap, compileAndEvaluateReactiveHTMLAsComponentTemplate, Component, DEFAULT_CONSTANTS_TO_IMPORT,
  DEFAULT_OBSERVABLE_CONSTANTS_TO_IMPORT,
  generateCreateElementFunctionWithCustomElements, OnCreate
} from '@lifaon/rx-dom';
import { const$$ } from '@lifaon/rx-js-light-shortcuts';
import { AppNumberInputComponent } from './number/number-input.component';
import { AppFormComponent } from './form/form.component';


/** MAIN **/

export const APP_MAIN_CUSTOM_ELEMENTS = [
  AppFormComponent,
  AppNumberInputComponent,
];

interface IData {
}

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  ...DEFAULT_OBSERVABLE_CONSTANTS_TO_IMPORT,
  createElement: generateCreateElementFunctionWithCustomElements(APP_MAIN_CUSTOM_ELEMENTS),
};

@Component({
  name: 'app-main',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(`
    <app-form>
<!--      {{ pipe(idle(), [map(() => Date.now())]) }}-->
      <app-number-input></app-number-input>
    </app-form>
  `, CONSTANTS_TO_IMPORT),
  // style: compileReactiveCSSAsComponentStyle(style),
})
class AppMainComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super();
    this._data = {};
  }

  onCreate(): IData {
    return this._data;
  }

}

/** DEBUG **/

function formControlDebug1() {
  const input = new AppNumberInputComponent();
  bootstrap(input);

  input.required$ = const$$(true);
  input.min$ = const$$(5);
  // input.required = true;

  input.validity.valid$((value: boolean) => {
    console.log('valid$', value);
  });

  (window as any).input = input;
  (window as any).const$$ = const$$;
}

function formControlDebug2() {
  bootstrap(new AppMainComponent());
}


/*-------------*/

export function formControlDebug() {
  // formControlDebug1();
  formControlDebug2();
}

