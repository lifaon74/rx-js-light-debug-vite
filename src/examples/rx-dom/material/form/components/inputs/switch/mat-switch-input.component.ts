import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, IDynamicStyleValue,
  OnCreate, querySelectorOrThrow, defineObservableProperty,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-switch-input.component.html?raw';
// @ts-ignore
import style from './mat-switch-input.component.scss?inline';
import { INPUT_VALUE_MODIFIER } from '../../../modifiers/input-value.modifier';
import { MatInputComponent } from '../shared/input/mat-input.component';

/** TYPES **/

export type IMatSwitchInputComponentState = 'off' | 'on' | 'indeterminate';

/** COMPONENT **/

interface IData {
  // readonly previewColor$: IObservable<IDynamicStyleValue>;
}

/*-----*/

@Component({
  name: 'mat-switch-input',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html,
    modifiers: [
      INPUT_VALUE_MODIFIER,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
  // useShadowDOM: true,
})
export class MatSwitchInputComponent extends MatInputComponent<IMatSwitchInputComponentState> implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super('indeterminate');

    /** VARIABLES **/

    const $value = this.$value;
    const value$ = this.value$;

    const disabled$ = this.disabled$;
    const readonly$ = this.readonly$;

    this._data = {
      disabled$,
      readonly$,
    };
  }

  onCreate(): IData {
    return this._data;
  }
}

