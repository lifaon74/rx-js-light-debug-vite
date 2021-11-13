import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component,
  defineObservableProperty, OnCreate, querySelectorOrThrow,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-select-input.component.html?raw';
// @ts-ignore
import style from './mat-select-input.component.scss?inline';
import { INPUT_VALUE_MODIFIER } from '../../../modifiers/input-value.modifier';
import {
  combineLatest, function$$, IObservable, IObserver, let$$, map$$, map$$$, mergeMapS$$$, pipe$$, shareR$$, single
} from '@lifaon/rx-js-light';
import {
  IMatSelectInputOption, IMatSelectInputOptionsList, IMatSelectInputReadonlySelectedOptions,
} from './types/mat-select-input-option.type';
import { ON_FOCUSED_MODIFIER } from '../../../modifiers/on-focused.modifier';
import { isSet } from '../../../../../../misc/is/is-set';
import { createMatOverlayController } from '../../../../overlay/overlay/component/helpers/create-open-close-tuple';
import { MatOverlayManagerComponent } from '../../../../overlay/overlay/manager/mat-overlay-manager.component';
import { MatSelectInputOverlayComponent } from './overlay/mat-select-overlay.component';
import { toggleOptionSelect } from '../../../../helpers/options/toggle-option-select';
import { isOptionSelected } from '../../../../helpers/options/is-option-selected';
import { $$filter } from '../../../../../../../../../rx-js-light/dist/src/observer/pipes/built-in/filter/filter-observer.shortcut';
import {
  addMatInputReadonlyFunctionality, IMatInputReadonlyProperty
} from '../shared/functionalities/readonly/add-mat-input-readonly-functionality';
import {
  addMatInputDisabledFunctionality, IMatInputDisabledProperty
} from '../shared/functionalities/disabled/add-mat-input-disabled-functionality';
import {
  addMatInputPlaceholderFunctionality, IMatInputPlaceholderProperty
} from '../shared/functionalities/placeholder/add-mat-input-placeholder-functionality';
import {
  addOptionsManagerMultipleFunctionality, addOptionsManagerOptionsFunctionality,
  addOptionsManagerRawOptionsFunctionality, addOptionsManagerRawSelectedOptionsFunctionality,
  addOptionsManagerSelectedOptionsFunctionality,
  IOptionsManagerMultipleProperty,
  IOptionsManagerOptionsProperty, IOptionsManagerProperties, IOptionsManagerRawOptionsProperty,
  IOptionsManagerRawSelectedOptionsProperty, IOptionsManagerSelectedOptionsProperty
} from '../../../../helpers/options/options-manager';
import { toggleOptionSelectWithResolvers } from '../../../../helpers/options/toggle-option-select-with-resolvers';
import { injectMatInputFieldStyle } from '../shared/input-field/mat-input-field.component';


/** MANAGER **/

interface IMatSelectInputComponentConstructor {
  new<GValue>(): (
    HTMLElement
    & IMatInputReadonlyProperty
    & IMatInputDisabledProperty
    & IMatInputPlaceholderProperty
    & IOptionsManagerProperties<IMatSelectInputOption<GValue>>
  );
}

/** COMPONENT **/

type IFieldContainerMode = 'value' | 'placeholder' | 'filter';

interface IData {
  readonly placeholder$: IObservable<string>;
  readonly selectValue$: IObservable<string>;

  readonly $onClickSelectValue: IObserver<MouseEvent>;
  readonly $onKeyDownSelectValue: IObserver<KeyboardEvent>;
}

@Component({
  name: 'mat-select-input',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html,
    modifiers: [
      INPUT_VALUE_MODIFIER,
      // NODE_REFERENCE_MODIFIER,
      ON_FOCUSED_MODIFIER,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
// export class MatSelectInputComponent<GValue> extends optionsManagerFactory(MatInputFieldComponent)<IMatSelectInputOptionsList<GValue>> implements OnCreate<IData> {
export class MatSelectInputComponent<GValue> extends (HTMLElement as IMatSelectInputComponentConstructor)<GValue> implements OnCreate<IData> {
  protected readonly _data: IData;

  constructor() {
    super();

    type GOption = IMatSelectInputOption<GValue>;

    /** FUNCTIONALITIES **/

    const readonly$ = addMatInputReadonlyFunctionality(this);
    const disabled$ = addMatInputDisabledFunctionality(this);
    const placeholder$ =  addMatInputPlaceholderFunctionality(this);

    const rawOptions$ = addOptionsManagerRawOptionsFunctionality<GOption>(this);
    const rawSelectedOptions$ = addOptionsManagerRawSelectedOptionsFunctionality<GOption>(this);
    const multiple$ = addOptionsManagerMultipleFunctionality(this);
    const options$ = addOptionsManagerOptionsFunctionality<GOption>(this, rawOptions$);
    const selectedOptions$ = addOptionsManagerSelectedOptionsFunctionality<GOption>(this, rawOptions$, options$, multiple$);

    injectMatInputFieldStyle(this);

    // OVERLAY

    const $close = () => {
      querySelectorOrThrow<HTMLElement>(this, ':scope > .select-value').focus();
    };

    const { toggle } = createMatOverlayController<[]>((): MatSelectInputOverlayComponent<GValue> => {
      return MatOverlayManagerComponent.getInstance()
        .open(MatSelectInputOverlayComponent, [{
          targetElement: this,
          options$,
          $close,
          selectedOptions$,
          $rawSelectedOptions: this.$rawSelectedOptions,
          multiple$,
        }]);
    });

    const toggleMatSelectInputOverlay = () => {
      if (!this.disabled && !this.readonly) {
        toggle([]);
      }
    };

    /** SELECT VALUE **/

    const selectValue$ = pipe$$(selectedOptions$, [
      mergeMapS$$$((options: IMatSelectInputReadonlySelectedOptions<GValue>): IObservable<readonly string[]> => {
        return combineLatest(
          Array.from(options, (option: IMatSelectInputOption<GValue>): IObservable<string> => {
            return option.label$;
          }),
        );
      }),
      map$$$((labels: readonly string[]) => labels.join(', ')),
    ]);


    const $onClickSelectValue = toggleMatSelectInputOverlay;
    const $onKeyDownSelectValue = $$filter(toggleMatSelectInputOverlay, (event: KeyboardEvent) => (event.key === 'Enter'));

    this._data = {
      placeholder$,
      selectValue$,
      $onClickSelectValue,
      $onKeyDownSelectValue,
    };
  }

  onCreate(): IData {
    return this._data;
  }

  isOptionSelected(
    option: IMatSelectInputOption<GValue>,
  ): IObservable<boolean> {
    return isOptionSelected<IMatSelectInputOption<GValue>>({
      selectedOptions$: this.selectedOptions$,
      option,
    });
  }

  toggleOptionSelect(
    option: IMatSelectInputOption<GValue>,
    select?: boolean,
  ): void {
    toggleOptionSelectWithResolvers<IMatSelectInputOption<GValue>>({
      selectedOptions$: this.selectedOptions$,
      $rawSelectedOptions: this.$rawSelectedOptions,
      multiple$: this.multiple$,
      option,
      select,
    });
  }
}


