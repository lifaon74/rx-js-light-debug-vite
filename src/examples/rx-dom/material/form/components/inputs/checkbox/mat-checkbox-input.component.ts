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
import {
  combineLatest, createMulticastSource, IObserver, IObservable, single, map$$, tuple
} from '@lifaon/rx-js-light';
import { isElementOrChildrenFocusedObservable } from '../../../../helpers/focus-subscribe-function';

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

    const classList$ = map$$(value$, (state: IMatCheckboxInputState) => new Set<string>([`mat-${state}`]));
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
