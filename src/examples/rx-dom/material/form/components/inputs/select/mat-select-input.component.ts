import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate,
  querySelectorOrThrow,
  setComponentSubscribeFunctionProperties,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-select-input.component.html?raw';
// @ts-ignore
import style from './mat-select-input.component.scss?inline';
import {
  $$filter, function$$, let$$, map$$, map$$$, mergeMapS$$$, pipe$$, shareR$$
} from '@lifaon/rx-js-light-shortcuts';
import { INPUT_VALUE_MODIFIER } from '../../../modifiers/input-value.modifier';
import {
  combineLatest, IEmitFunction, ISubscribeFunction, readSubscribeFunctionValue, single
} from '@lifaon/rx-js-light';
import {
  IMatSelectInputOption, IMatSelectInputOptionsList, IMatSelectInputReadonlySelectedOptions,
  IMatSelectInputSelectedOptions,
} from './types/mat-select-input-option.type';
import { ON_FOCUSED_MODIFIER } from '../../../modifiers/on-focused.modifier';
import { MatInputFieldComponent } from '../shared/input-field/mat-input-field.component';
import { isSet } from '../../../../../../misc/is/is-set';
import { createMatOverlayController } from '../../../../overlay/overlay/component/helpers/create-open-close-tuple';
import { MatOverlayManagerComponent } from '../../../../overlay/overlay/manager/mat-overlay-manager.component';
import { MatSelectInputOverlayComponent } from './overlay/mat-select-overlay.component';


/** COMPONENT **/

type IFieldContainerMode = 'value' | 'placeholder' | 'filter';

interface IData {
  readonly placeholder$: ISubscribeFunction<string>;
  readonly selectValue$: ISubscribeFunction<string>;

  readonly $onClickSelectValue: IEmitFunction<MouseEvent>;
  readonly $onKeyDownSelectValue: IEmitFunction<KeyboardEvent>;
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
export class MatSelectInputComponent<GValue> extends MatInputFieldComponent<IMatSelectInputOptionsList<GValue>> implements OnCreate<IData> {

  multiple$!: ISubscribeFunction<boolean>;
  readonly $multiple!: IEmitFunction<boolean>;
  multiple!: boolean;

  options$!: ISubscribeFunction<IMatSelectInputOptionsList<GValue>>;
  readonly $options!: IEmitFunction<IMatSelectInputOptionsList<GValue>>;
  options!: IMatSelectInputOptionsList<GValue>;

  readonly optionsSet$: ISubscribeFunction<IMatSelectInputReadonlySelectedOptions<GValue>>;
  readonly selectedOptions$: ISubscribeFunction<IMatSelectInputReadonlySelectedOptions<GValue>>;

  protected readonly _data: IData;

  constructor() {
    super([]);

    /** VARIABLES **/

    const value$ = this.value$;
    const placeholder$ = this.placeholder$;

    const $multiple$ = let$$<ISubscribeFunction<boolean>>(single(false));
    setComponentSubscribeFunctionProperties(this, 'multiple', $multiple$);
    const multiple$ = this.multiple$;

    const $options$ = let$$<ISubscribeFunction<IMatSelectInputOptionsList<GValue>>>(single([]));
    setComponentSubscribeFunctionProperties(this, 'options', $options$);
    const options$ = this.options$;

    const optionsSet$ = shareR$$(map$$(options$, (options: IMatSelectInputOptionsList<GValue>): IMatSelectInputReadonlySelectedOptions<GValue> => {
      return isSet<IMatSelectInputOption<GValue>>(options)
        ? options
        : new Set<IMatSelectInputOption<GValue>>(options);
    }));
    this.optionsSet$ = optionsSet$;

    const selectedOptions$ = function$$(
      [value$, optionsSet$, multiple$],
      (
        rawSelectedOptions: IMatSelectInputOptionsList<GValue>,
        optionsSet: IMatSelectInputReadonlySelectedOptions<GValue>,
        multiple: boolean,
      ): IMatSelectInputReadonlySelectedOptions<GValue> => {
        const selectedOptions = new Set<IMatSelectInputOption<GValue>>();
        const iterator: Iterator<IMatSelectInputOption<GValue>> = rawSelectedOptions[Symbol.iterator]();
        let result: IteratorResult<IMatSelectInputOption<GValue>>;
        while (!(result = iterator.next()).done) {
          const option: IMatSelectInputOption<GValue> = result.value;
          if (optionsSet.has(option)) {
            selectedOptions.add(option);
            if (!multiple) {
              break;
            }
          }
        }
        return selectedOptions;
      },
    );

    this.selectedOptions$ = selectedOptions$;

    // OVERLAY

    const $close = () => {
      querySelectorOrThrow<HTMLElement>(this, ':scope > .select-value').focus();
    };

    const { toggle } = createMatOverlayController<[]>((): MatSelectInputOverlayComponent<GValue> => {
      return MatOverlayManagerComponent.getInstance()
        .open(MatSelectInputOverlayComponent, [{
          targetElement: this,
          optionsSet$,
          $close,
        }]);
    });

    const toggleMatColorInputOverlay = () => {
      if (!this.disabled && !this.readonly) {
        toggle([]);
      }
    };

    /** SELECT VALUE **/

    const selectValue$ = pipe$$(selectedOptions$, [
      mergeMapS$$$((options: IMatSelectInputReadonlySelectedOptions<GValue>): ISubscribeFunction<readonly string[]> => {
        return combineLatest(
          Array.from(options, (option: IMatSelectInputOption<GValue>): ISubscribeFunction<string> => {
            return option.label$;
          }),
        );
      }),
      map$$$((labels: readonly string[]) => labels.join(', ')),
    ]);


    const $onClickSelectValue = toggleMatColorInputOverlay;
    const $onKeyDownSelectValue = $$filter(toggleMatColorInputOverlay, (event: KeyboardEvent) => (event.key === 'Enter'));

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
  ): ISubscribeFunction<boolean> {
    return isMatSelectInputOptionSelected<GValue>(
      this.selectedOptions$,
      option,
    );
  }

  toggleOptionSelect(
    option: IMatSelectInputOption<GValue>,
    select?: boolean,
  ): void {
    toggleMatSelectInputOptionSelect(
      this.selectedOptions$,
      this.$value,
      option,
      select,
    );
  }
}


/** FUNCTION **/

export function isMatSelectInputOptionSelected<GValue>(
  selectedOptions$: ISubscribeFunction<IMatSelectInputReadonlySelectedOptions<GValue>>,
  option: IMatSelectInputOption<GValue>,
): ISubscribeFunction<boolean> {
  return map$$(selectedOptions$, (options: IMatSelectInputReadonlySelectedOptions<GValue>): boolean => {
    return options.has(option);
  });
}

export function toggleMatSelectInputOptionSelect<GValue>(
  selectedOptions$: ISubscribeFunction<IMatSelectInputReadonlySelectedOptions<GValue>>,
  $value: IEmitFunction<IMatSelectInputOptionsList<GValue>>,
  option: IMatSelectInputOption<GValue>,
  select?: boolean,
): void {
  const selectedOptions: IMatSelectInputSelectedOptions<GValue> = readSubscribeFunctionValue(selectedOptions$, () => {
    throw new Error(`Cannot read selectedOptions$`);
  }) as IMatSelectInputSelectedOptions<GValue>;

  let changed: boolean = false;

  if (select === void 0) {
    changed = true;
    if (selectedOptions.has(option)) {
      selectedOptions.delete(option);
    } else {
      selectedOptions.add(option);
    }
  } else if (select) {
    if (!selectedOptions.has(option)) {
      changed = true;
      selectedOptions.add(option);
    }
  } else {
    if (selectedOptions.has(option)) {
      changed = true;
      selectedOptions.delete(option);
    }
  }

  if (changed) {
    $value(selectedOptions);
  }
}
