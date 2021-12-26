import { eq$$, function$$, IObservable, IObserver, map$$, readObservableValue } from '@lifaon/rx-js-light';
import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component,
  defineSimpleObservableProperty, IHavingObservableProperty, OnCreate, toReactiveContent,
} from '@lifaon/rx-dom';

// @ts-ignore
import html from './generic-range-input.component.html?raw';
// @ts-ignore
import style from './generic-range-input.component.scss?inline';
import { MAT_TOOLTIP_MODIFIER } from '../../../material/overlay/build-in/tooltip/mat-tooltip.modifier';
import {
  MatCheckboxInputComponent
} from '../../../material/form/components/inputs/checkbox/mat-checkbox-input.component';
import {
  addOptionsManagerMultipleFunctionality, addOptionsManagerOptionsFunctionality,
  addOptionsManagerRawOptionsFunctionality, addOptionsManagerRawSelectedOptionsFunctionality,
  addOptionsManagerSelectedOptionsFunctionality,
} from '../../../material/helpers/options/options-manager';


/** TYPES **/

export interface IGenericRangeInputOption<GValue> {
  readonly label$: IObservable<string>;
  readonly value: GValue;
}

export type IGenericRangeInputOptionsList<GValue> = readonly IGenericRangeInputOption<GValue>[];


interface IGenericRangeInputProperties<GValue> extends //
  IHavingObservableProperty<'options', IGenericRangeInputOptionsList<GValue>>,
  IHavingObservableProperty<'selectedOptionIndex', number>
//
{

}

/** COMPONENT **/

interface IData<GValue> {
  readonly options$: IObservable<IGenericRangeInputOptionsList<GValue>>;
  readonly onClickOption: (index: IObservable<number>) => void;
  // helpers
  readonly toReactiveContent: typeof toReactiveContent;
  readonly isOptionSelected$$: (index: IObservable<number>) => IObservable<any>;
}

@Component({
  name: 'app-generic-range-input',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html,
    customElements: [
      MatCheckboxInputComponent,
    ],
    modifiers: [
      MAT_TOOLTIP_MODIFIER,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppGenericRangeInputComponent<GValue> extends HTMLElement implements OnCreate<IData<GValue>>, IGenericRangeInputProperties<GValue> {

  options$!: IObservable<IGenericRangeInputOptionsList<GValue>>;
  readonly $options!: IObserver<IGenericRangeInputOptionsList<GValue>>;
  options!: IGenericRangeInputOptionsList<GValue>;

  selectedOptionIndex$!: IObservable<number>;
  readonly $selectedOptionIndex!: IObserver<number>;
  selectedOptionIndex!: number;

  readonly selectedOption$: IObservable<IGenericRangeInputOption<GValue> | null>;

  protected readonly _data: IData<GValue>;

  constructor() {
    super();

    // const rawOptions$ = addOptionsManagerRawOptionsFunctionality<GOption>(this);
    // const rawSelectedOptions$ = addOptionsManagerRawSelectedOptionsFunctionality<GOption>(this);
    // const multiple$ = addOptionsManagerMultipleFunctionality(this);
    // const options$ = addOptionsManagerOptionsFunctionality<GOption>(this, rawOptions$);
    // const selectedOptions$ = addOptionsManagerSelectedOptionsFunctionality<GOption>(this, rawOptions$, options$, multiple$);

    const options$ = defineSimpleObservableProperty<IGenericRangeInputOptionsList<GValue>>(this, 'options', []);
    const selectedOptionIndex$ = defineSimpleObservableProperty<number>(this, 'selectedOptionIndex', 0);

    const selectedOption$ = function$$(
      [options$, selectedOptionIndex$],
      (options: IGenericRangeInputOptionsList<GValue>, selectedOptionIndex: number): IGenericRangeInputOption<GValue> | null => {
        return ((0 <= selectedOptionIndex) && (selectedOptionIndex < options.length))
          ? options[selectedOptionIndex]
          : null;
      },
    );
    this.selectedOption$ = selectedOption$;

    const isOptionSelected$$ = (index: IObservable<number>): IObservable<any> => {
      return eq$$(index, selectedOptionIndex$);
    };


    const onClickOption = (index$: IObservable<number>) => {
      const index = readObservableValue(index$, () => {
        throw new Error(`Cannot read index$`);
      });

      this.selectedOptionIndex = index;
    };

    this._data = {
      options$,
      onClickOption,
      toReactiveContent,
      isOptionSelected$$,
    };
  }

  public onCreate(): IData<GValue> {
    return this._data;
  }
}
