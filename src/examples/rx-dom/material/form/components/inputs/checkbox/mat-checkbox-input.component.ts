import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate,
  setReactiveClass, setReactiveClassList, setReactiveEventListener, subscribeOnNodeConnectedTo, uuid,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-checkbox-input.component.html?raw';
// @ts-ignore
import style from './mat-checkbox-input.component.scss?inline';
import { INPUT_VALUE_MODIFIER } from '../../../modifiers/input-value.modifier';
import { MatInputComponent } from '../shared/input/mat-input.component';
import { combineLatest, createMulticastSource, IEmitFunction, ISubscribeFunction, single } from '@lifaon/rx-js-light';
import { map$$ } from '@lifaon/rx-js-light-shortcuts';
import { isElementOrChildrenFocusedSubscribeFunction } from '../../../../helpers/focus-subscribe-function';
import { tuple } from '../../../../../../misc/tuple';

/** TYPES **/

export type IMatCheckboxInputState =
  'off'
  | 'on'
  | 'indeterminate'
  ;

/** COMPONENT **/

interface IData {
  // SUBSCRIBE FUNCTIONS
  readonly id$: ISubscribeFunction<string>;
  readonly disabled$: ISubscribeFunction<boolean>;
  readonly readonly$: ISubscribeFunction<boolean>;
  readonly inputChecked$: ISubscribeFunction<boolean>;
  readonly inputIndeterminate$: ISubscribeFunction<boolean>;
  // EMIT FUNCTIONS
  readonly $inputChange: IEmitFunction<Event>;
}

/*-----*/

@Component({
  name: 'mat-checkbox-input',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html,
    modifiers: [
      INPUT_VALUE_MODIFIER,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatCheckboxInputComponent extends MatInputComponent<IMatCheckboxInputState> implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super('off');
    // super('indeterminate');
    // super('on');

    /** VARIABLES **/

    const $value = this.$value;
    const value$ = this.value$;

    const disabled$ = this.disabled$;
    const readonly$ = this.readonly$;

    const id$ = single(uuid());

    /** INPUT **/

    const inputChecked$ = map$$(value$, (state: IMatCheckboxInputState) => (state === 'on'));
    const inputIndeterminate$ = map$$(value$, (state: IMatCheckboxInputState) => (state === 'indeterminate'));

    const { emit: $inputChange, subscribe: _inputChange$ } = createMulticastSource<Event>();

    const inputChange$ = combineLatest(tuple(
      readonly$,
      _inputChange$,
    ));

    subscribeOnNodeConnectedTo(this, inputChange$, ([readonly, event]) => {
      if (!readonly) {
        $value(
          (event.target as HTMLInputElement).checked ? 'on' : 'off'
        );
      }
    });

    /** DIRECT DOM UPDATE **/

    const classList$ = map$$(value$, (state: IMatCheckboxInputState) => new Set<IMatCheckboxInputState>([state]));
    setReactiveClassList(classList$, this);

    setReactiveClass(isElementOrChildrenFocusedSubscribeFunction(this), this, 'focused');

    // INFO prevent blur
    setReactiveEventListener((event: PointerEvent): void => {
      event.preventDefault();
    }, this, 'pointerdown');

    this._data = {
      id$,
      disabled$,
      readonly$,
      inputChecked$,
      inputIndeterminate$,
      $inputChange,
    };
  }

  onCreate(): IData {
    return this._data;
  }
}


/** FUNCTIONS **/

function matCheckboxInputStateToIconClass(
  state: IMatCheckboxInputState,
): string {
  switch (state) {
    case 'on':
      return 'icon-mat-check';
    case 'off':
      return '';
    case 'indeterminate':
      return 'icon-mat-minus';
  }
}
