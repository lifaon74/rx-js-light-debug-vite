import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, IReactiveContent,
  OnCreate,
  querySelectorOrThrow, toReactiveContent,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-select-input.component.html?raw';
// @ts-ignore
import style from './mat-select-input.component.scss?inline';
import { INPUT_VALUE_MODIFIER } from '../../../modifiers/input-value.modifier';
import {
  combineLatest, IObservable, IObserver, map$$, map$$$, mergeMapS$$$, pipe$$, single,
} from '@lifaon/rx-js-light';
import { IMatSelectInputOption, IMatSelectInputReadonlySelectedOptions } from './types/mat-select-input-option.type';
import { ON_FOCUSED_MODIFIER } from '../../../modifiers/on-focused.modifier';
import { createMatOverlayController } from '../../../../overlay/overlay/__component/helpers/create-open-close-tuple';
import { MatOverlayManagerComponent } from '../../../../overlay/overlay/manager/mat-overlay-manager.component';
import { MatSelectInputOverlayComponent } from './overlay/mat-select-overlay.component';
import { isOptionSelected } from '../../../../helpers/options/is-option-selected';
import {
  $$filter,
} from '../../../../../../../../../rx-js-light/dist/src/observer/pipes/built-in/filter/filter-observer.shortcut';
import {
  addMatInputReadonlyFunctionality, IMatInputReadonlyProperty,
} from '../shared/functionalities/readonly/add-mat-input-readonly-functionality';
import {
  addMatInputDisabledFunctionality, IMatInputDisabledProperty,
} from '../shared/functionalities/disabled/add-mat-input-disabled-functionality';
import {
  addMatInputPlaceholderFunctionality, IMatInputPlaceholderProperty,
} from '../shared/functionalities/placeholder/add-mat-input-placeholder-functionality';
import {
  addOptionsManagerMultipleFunctionality, addOptionsManagerOptionsFunctionality,
  addOptionsManagerRawOptionsFunctionality, addOptionsManagerRawSelectedOptionsFunctionality,
  addOptionsManagerSelectedOptionsFunctionality, IOptionsManagerProperties,
} from '../../../../helpers/options/options-manager';
import { toggleOptionSelectWithResolvers } from '../../../../helpers/options/toggle-option-select-with-resolvers';
import { injectMatInputFieldStyle } from '../shared/input-field/mat-input-field.component';
import { isEnterOrSpace } from '../../../../helpers/is-enter-or-space';
import {
  addMatInputClearableFunctionality, IMatInputClearableProperty,
} from '../shared/functionalities/clearable/add-mat-input-clearable-functionality';
import { addMatInputEmptyClass } from '../shared/functionalities/empty/add-mat-input-readonly-functionality';
import { MAT_CLEAR_ICON_TITLE } from '../../../../constants/mat-clear-icon-title.constant';

/** CONSTRUCTOR **/

interface IMatSelectInputComponentConstructor {
  new<GValue>(): (
    HTMLElement
    & IMatInputReadonlyProperty
    & IMatInputDisabledProperty
    & IMatInputClearableProperty
    & IMatInputPlaceholderProperty
    & IOptionsManagerProperties<IMatSelectInputOption<GValue>>
    );
}

/** COMPONENT **/

type IFieldContainerMode = 'value' | 'placeholder' | 'filter';

interface IData {
  readonly placeholder$: IObservable<string>;
  readonly selectValue$: IObservable<string>;
  readonly clearIconTitle$: IObservable<string>;

  readonly $onClickSelectValue: IObserver<MouseEvent>;
  readonly $onKeyDownSelectValue: IObserver<KeyboardEvent>;
  readonly $onClickClearIcon: IObserver<MouseEvent>;
}

@Component({
  name: 'mat-select-input',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html,
    modifiers: [],
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
    const clearable$ = addMatInputClearableFunctionality(this);
    const placeholder$ = addMatInputPlaceholderFunctionality(this);

    const rawOptions$ = addOptionsManagerRawOptionsFunctionality<GOption>(this);
    const rawSelectedOptions$ = addOptionsManagerRawSelectedOptionsFunctionality<GOption>(this);
    const multiple$ = addOptionsManagerMultipleFunctionality(this);
    const options$ = addOptionsManagerOptionsFunctionality<GOption>(this, { rawOptions$ });
    const selectedOptions$ = addOptionsManagerSelectedOptionsFunctionality<GOption>(this, {
      rawSelectedOptions$,
      options$,
      multiple$,
    });

    injectMatInputFieldStyle(this);

    addMatInputEmptyClass(
      this,
      map$$(selectedOptions$, (selectedOptions: IMatSelectInputReadonlySelectedOptions<GValue>) => (selectedOptions.size === 0)),
    );

    // OVERLAY

    const $close = () => {
      querySelectorOrThrow<HTMLElement>(this, ':scope > .select-value').focus();
    };

    const { toggle } = createMatOverlayController<[]>((): MatSelectInputOverlayComponent<GValue> => {
      return MatOverlayManagerComponent.getInstance()
        .open_legacy(MatSelectInputOverlayComponent, [{
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
    const $onKeyDownSelectValue = $$filter(
      toggleMatSelectInputOverlay,
      isEnterOrSpace,
    );

    /** CLEAR ICON **/

    const clearIconTitle$ = MAT_CLEAR_ICON_TITLE;

    const $onClickClearIcon = (): void => {
      this.$rawSelectedOptions([]);
    };

    this._data = {
      placeholder$,
      selectValue$,
      clearIconTitle$,
      $onClickSelectValue,
      $onKeyDownSelectValue,
      $onClickClearIcon,
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


