import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component,
  defineObservableProperty, IHavingObservableProperty, OnCreate,
  setReactiveClass, setReactiveClassList, setReactiveEventListener, subscribeOnNodeConnectedTo, uuid,
} from '@lifaon/rx-dom';
;
import { INPUT_VALUE_MODIFIER } from '../../../modifiers/input-value.modifier';
import {
  combineLatest, createMulticastSource, IObserver, IObservable, single, map$$, tuple, let$$,
} from '@lifaon/rx-js-light';
import { isElementOrChildrenFocusedObservable } from '../../../../helpers/focus-subscribe-function';
import {
  addMatInputReadonlyFunctionality, IMatInputReadonlyProperty,
} from '../shared/functionalities/readonly/add-mat-input-readonly-functionality';
import {
  addMatInputDisabledFunctionality, IMatInputDisabledProperty,
} from '../shared/functionalities/disabled/add-mat-input-disabled-functionality';

// @ts-ignore
import html from './mat-checkbox-input.component.html?raw';
// @ts-ignore
import style from './mat-checkbox-input.component.scss?inline'


/** CONSTRUCTOR **/

interface IMatCheckboxInputComponentConstructor {
  new(): (
    HTMLElement
    & IMatInputReadonlyProperty
    & IMatInputDisabledProperty
    & IHavingObservableProperty<'state', IMatCheckboxInputState>
    );
}

/** TYPES **/

export type IMatCheckboxInputState =
  'off'
  | 'on'
  | 'indeterminate'
  ;

/** COMPONENT **/

interface IData {
  // SUBSCRIBE FUNCTIONS
  readonly id$: IObservable<string>;
  readonly disabled$: IObservable<boolean>;
  readonly readonly$: IObservable<boolean>;
  readonly inputChecked$: IObservable<boolean>;
  readonly inputIndeterminate$: IObservable<boolean>;
  // EMIT FUNCTIONS
  readonly $inputChange: IObserver<Event>;
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
  styles: [
    compileReactiveCSSAsComponentStyle(style),
  ],
})
export class MatCheckboxInputComponent extends (HTMLElement as IMatCheckboxInputComponentConstructor) implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super();

    /** FUNCTIONALITIES **/

    addMatInputReadonlyFunctionality(this);
    addMatInputDisabledFunctionality(this);

    /** VARIABLES **/

    const $state$ = let$$<IObservable<IMatCheckboxInputState>>(single('off'));
    defineObservableProperty(this, 'state', $state$);

    const $state = this.$state;
    const state$ = this.state$;

    const disabled$ = this.disabled$;
    const readonly$ = this.readonly$;

    const id$ = single(uuid());

    /** INPUT **/

    const inputChecked$ = map$$(state$, (state: IMatCheckboxInputState) => (state === 'on'));
    const inputIndeterminate$ = map$$(state$, (state: IMatCheckboxInputState) => (state === 'indeterminate'));

    const { emit: $inputChange, subscribe: _inputChange$ } = createMulticastSource<Event>();

    const inputChange$ = combineLatest(tuple(
      readonly$,
      _inputChange$,
    ));

    subscribeOnNodeConnectedTo(this, inputChange$, ([readonly, event]) => {
      if (!readonly) {
        $state(
          (event.target as HTMLInputElement).checked ? 'on' : 'off'
        );
      }
    });

    /** DIRECT DOM UPDATE **/

    const classList$ = map$$(state$, (state: IMatCheckboxInputState) => new Set<string>([`mat-${state}`]));
    setReactiveClassList(classList$, this);

    setReactiveClass(isElementOrChildrenFocusedObservable(this), this, 'mat-focused');

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
