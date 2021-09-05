import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, generateGetNodeModifierFunctionFromArray, HTMLElementConstructor,
  IReactiveClassListValue, OnCreate,
  onNodeConnectedToWithImmediateCached, querySelectorOrThrow, setReactiveClassList, subscribeOnNodeConnectedTo,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-select.component.html?raw';
// @ts-ignore
import style from './mat-select.component.scss';
import { havingMultipleSubscribeFunctionProperties } from '../../../../misc/having-multiple-subscribe-function-properties';
import { createHigherOrderVariable } from '../../../../misc/create-higher-order-variable';
import { function$$, let$$, letU$$, map$$, mergeAllS$$, mergeMapS$$, share$$ } from '@lifaon/rx-js-light-shortcuts';
import { INPUT_VALUE_MODIFIER } from '../modifiers/input-value.modifier';
import {
  combineLatest, freeze, IEmitFunction, IMulticastReplayLastSource, ISubscribeFunction, IUnsubscribeFunction, merge,
  mergeUnsubscribeFunctions, noop, single
} from '@lifaon/rx-js-light';
import { NODE_REFERENCE_MODIFIER } from '../modifiers/node-reference.modifier';
import {
  focusSubscribeFunction, focusSubscribeFunctionDebounced, isElementOrChildrenFocusedSubscribeFunctionDebounced
} from '../../helpers/focus-subscribe-function';
import { MatOverlayManagerComponent } from '../../overlay/overlay/manager/mat-overlay-manager.component';
import { MatSelectOverlayComponent } from './overlay/mat-select-overlay.component';
import { createOpenCloseTuple } from '../../overlay/overlay/component/helpers/create-open-close-tuple';
import {
  IMatSelectOption, INormalizedMatSelectOption, IReadonlyNormalizedMatSelectOption
} from './types/mat-select-option.type';
import { focusElement } from '../../helpers/focus-element';
import { ON_FOCUSED_MODIFIER } from '../modifiers/on-focused.modifier';
import { Keyboard } from 'puppeteer';


/** FUNCTIONS **/


let MAT_SELECT_OPTION_UUID = 0;

function getMatSelectOptionUUID(): number {
  return MAT_SELECT_OPTION_UUID++;
}

function normalizeMatSelectOptions<GValue>(
  options: Iterable<IMatSelectOption<GValue>>,
): INormalizedMatSelectOption<GValue>[] {
  return Array.from(
    options,
    (option: IMatSelectOption<GValue>): INormalizedMatSelectOption<GValue> => {
      // const $selected$: IMulticastReplayLastSource<ISubscribeFunction<boolean>> = let$$<ISubscribeFunction<boolean>>(
      //   (option.selected$ === void 0)
      //     ? single(false)
      //     : option.selected$,
      // );
      // const selected$ = mergeAllS$$($selected$.subscribe);
      //
      // const $selected = (value: boolean) => {
      //   $selected$.emit(single(value));
      // };

      let $selected$: IMulticastReplayLastSource<boolean> = let$$<boolean>(false);
      const optionSelected$ = option.selected$;
      if (optionSelected$ !== void 0) {
        const _$selected$ = $selected$;
        $selected$ = freeze({
          ..._$selected$,
          // subscribe: merge([$selected$.subscribe, option.selected$]),
          subscribe: (emit: IEmitFunction<boolean>): IUnsubscribeFunction => {
            return mergeUnsubscribeFunctions([
              _$selected$.subscribe(emit),
              optionSelected$(_$selected$.emit),
            ]);
          },
        });
      }

      const disabled$: ISubscribeFunction<boolean> = (option.disabled$ === void 0)
        ? single(false)
        : merge([single(false), option.disabled$]);

      return {
        label$: option.label$,
        value: option.value,
        disabled$,
        $selected$,
      };
    },
  );
}

function convertNormalizedMatSelectOptionsToReadonly<GValue>(
  options: INormalizedMatSelectOption<GValue>[],
): IReadonlyNormalizedMatSelectOption<GValue>[] {
  return options.map((option: INormalizedMatSelectOption<GValue>): IReadonlyNormalizedMatSelectOption<GValue> => {
    return {
      label$: option.label$,
      value: option.value,
      selected$: option.$selected$.subscribe,
      disabled$: option.disabled$,
    };
  });
}

/*--*/

interface IOptionsListenerOptions<GValue> {
  input: HTMLInputElement;
  options: INormalizedMatSelectOption<GValue>[];
  multiple: boolean;
  $selectedOptions: IEmitFunction<INormalizedMatSelectOption<GValue>[]>;
}

function optionsListener<GValue>(
  {
    input,
    options,
    multiple,
    $selectedOptions,
  }: IOptionsListenerOptions<GValue>,
): ISubscribeFunction<never> {
  return (): IUnsubscribeFunction => {
    return mergeUnsubscribeFunctions(
      options.map((option: INormalizedMatSelectOption<GValue>): IUnsubscribeFunction => {
          return option.$selected$.subscribe((selected: boolean) => {
            if (selected && !multiple) {
              for (let i = 0, l = options.length; i < l; i++) {
                const _option: INormalizedMatSelectOption<GValue> = options[i];
                if ((_option !== option) && _option.$selected$.getValue()) {
                  _option.$selected$.emit(false);
                }
              }
            }

            if (multiple) {
              focusElement(input);
            }

            $selectedOptions(
              options.filter((option: INormalizedMatSelectOption<GValue>): boolean => {
                return option.$selected$.getValue();
              }),
            );
          });
        }
      )
    );
  };
}


/*--*/

function selectedOptionsToInputValue<GValue>(
  selectedOptions$: ISubscribeFunction<INormalizedMatSelectOption<GValue>[]>,
): ISubscribeFunction<string> {
  return mergeMapS$$(
    selectedOptions$,
    (options: INormalizedMatSelectOption<GValue>[]): ISubscribeFunction<string> => {
      return function$$(
        options.map((option: INormalizedMatSelectOption<GValue>): ISubscribeFunction<string> => {
          return option.label$;
        }),
        (...labels: string[]): string => {
          return labels.join(', ');
        },
      );

      // return map$$(
      //   combineLatest(
      //     options.map((option: INormalizedMatSelectOption<GValue>): ISubscribeFunction<string> => {
      //       return option.label$;
      //     }),
      //   ),
      //   (labels: readonly string[]): string => {
      //     return labels.join(', ');
      //   },
      // );
    },
  );
}

/** COMPONENT **/

type IFieldContainerMode = 'value' | 'placeholder' | 'filter';

type IMatSelectComponentInputs<GValue> = [
  ['multiple', boolean],
  ['readonly', boolean],
];

interface IData {
  // $fieldContainer: IEmitFunction<HTMLElement>;
  $focused: IEmitFunction<boolean>;
  $onKeyDown: IEmitFunction<KeyboardEvent>;
  fieldContainerClasses$: ISubscribeFunction<IReactiveClassListValue>;

  placeholder$: ISubscribeFunction<string>;
  selectValue$: ISubscribeFunction<string>;

  $filterInputValue$: IMulticastReplayLastSource<string>;
  $onClickClearIcon: IEmitFunction<MouseEvent>;

  // readonly$: ISubscribeFunction<boolean>;
  // $input: IEmitFunction<HTMLInputElement>;
}

const MAT_SELECT_MODIFIERS = [
  INPUT_VALUE_MODIFIER,
  // NODE_REFERENCE_MODIFIER,
  ON_FOCUSED_MODIFIER,
];

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  getNodeModifier: generateGetNodeModifierFunctionFromArray(MAT_SELECT_MODIFIERS)
};

@Component({
  name: 'mat-select',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(style),
})
export class MatSelectComponent<GValue> extends havingMultipleSubscribeFunctionProperties<IMatSelectComponentInputs<any>, HTMLElementConstructor>(HTMLElement) implements OnCreate<IData> {
  public readonly options$: ISubscribeFunction<IReadonlyNormalizedMatSelectOption<GValue>[]>;
  // public readonly selectedOptions$: ISubscribeFunction<IReadonlyNormalizedMatSelectOption<GValue>[]>;
  //
  protected readonly _$options$: IMulticastReplayLastSource<INormalizedMatSelectOption<GValue>[]>;

  protected readonly _data: IData;

  constructor() {
    const [$multiple$, multiple$] = createHigherOrderVariable<boolean>(true);
    const [$readonly$, readonly$] = createHigherOrderVariable<boolean>(false);
    const [$placeholder$, placeholder$] = createHigherOrderVariable<string>('place');

    super([
      ['multiple', $multiple$],
      ['readonly', $readonly$],
    ]);

    const { emit: $focused, subscribe: focused$ } = letU$$<boolean>();
    const { emit: $onKeyDown, subscribe: keyPressed$ } = letU$$<KeyboardEvent>();
    const $keyboardHoverOptionIndex$ = let$$<number>(-1);

    const $fieldContainerMode$ = let$$<IFieldContainerMode>('value');
    const { emit: $fieldContainerMode, subscribe: fieldContainerMode$ } = $fieldContainerMode$;

    const $filterInputValue$ = let$$<string>('');
    const { emit: $filterInputValue, subscribe: filterInputValue$ } = $filterInputValue$;

    const { emit: $onClickClearIcon, subscribe: onClickClearIcon$ } = letU$$<MouseEvent>();

    const fieldContainerClasses$ = map$$(fieldContainerMode$, (mode: IFieldContainerMode) => new Set([`mode-${ mode }`]));

    const focusFilterInput = () => {
      querySelectorOrThrow<HTMLInputElement>(this, '.filter-input > input').focus();
    };

    const focusFieldContainer = () => {
      querySelectorOrThrow<HTMLElement>(this, '.field-container').focus();
    };

    const leaveFilterMode = () => {
      $fieldContainerMode('value'); // TODO or placeholder
    };

    focused$((focused: boolean) => {
      console.log('focused', focused);
      if (!focused){
        $filterInputValue('');
        leaveFilterMode();
      }
    });

    keyPressed$((event: KeyboardEvent) => {
      if (event.key === 'ArrowDown') {
        $keyboardHoverOptionIndex$.emit($keyboardHoverOptionIndex$.getValue() + 1);
      } else if (event.key === 'ArrowDown') {
        $keyboardHoverOptionIndex$.emit($keyboardHoverOptionIndex$.getValue() + 1);
      } else {
        if ($fieldContainerMode$.getValue() !== 'filter') {
          $fieldContainerMode('filter');
          focusFilterInput();
        }
      }
    });

    filterInputValue$((value: string) => {
      console.log('filter value', value);
    });


    onClickClearIcon$(() => {
      if ($fieldContainerMode$.getValue() === 'filter') {
        $filterInputValue('');
        leaveFilterMode();
        focusFieldContainer();
      }
    });



    /** OPTIONS **/

    const $options$ = let$$<INormalizedMatSelectOption<GValue>[]>([]);
    this._$options$ = $options$;
    const options$ = $options$.subscribe;
    this.options$ = share$$(map$$(options$, convertNormalizedMatSelectOptionsToReadonly));


    const selectValue$ = single('abc');


    // const $filterInputValue$ = let$$<string>('');
    // const $inputValue = $inputValue$.emit;
    //
    // const { emit: $input, subscribe: input$ } = letU$$<HTMLInputElement>();
    //
    // // const focused$ = mergeMapS$$(input$, isElementOrChildrenFocusedSubscribeFunctionDebounced);
    // const focused$ = mergeMapS$$(input$, isElementOrChildrenFocusedSubscribeFunctionDebounced);
    // // TODO share ?
    // // TODO debounce ?
    //
    // const _$readonly$ = let$$(true);
    // const _readonly$ = _$readonly$.subscribe;
    //
    // /** OPTIONS **/
    //
    // const $options$ = let$$<INormalizedMatSelectOption<GValue>[]>([]);
    // this._$options$ = $options$;
    // const options$ = $options$.subscribe;
    // this.options$ = share$$(map$$(options$, convertNormalizedMatSelectOptionsToReadonly));
    //
    // const $selectedOptions$ = letU$$<INormalizedMatSelectOption<GValue>[]>();
    // const $selectedOptions = $selectedOptions$.emit;
    // const selectedOptions$ = $selectedOptions$.subscribe;
    // this.selectedOptions$ = share$$(map$$(selectedOptions$, convertNormalizedMatSelectOptionsToReadonly));
    //
    // // const optionsListener$ = mergeMapS$$(
    // //   combineLatest<[typeof input$, typeof options$, typeof multiple$]>([input$, options$, multiple$]),
    // //   ([
    // //     input,
    // //      options,
    // //      multiple,
    // //    ]: readonly [INormalizedMatSelectOption<GValue>[], boolean]): ISubscribeFunction<never> => {
    // //     return optionsListener<GValue>({
    // //       options,
    // //       multiple,
    // //       $selectedOptions,
    // //     });
    // //   },
    // // );
    // const optionsListener$ = mergeAllS$$(
    //   function$$(
    //     [input$, options$, multiple$],
    //     (
    //       input: HTMLInputElement,
    //       options: INormalizedMatSelectOption<GValue>[],
    //       multiple: boolean,
    //     ): ISubscribeFunction<never> => {
    //       return optionsListener<GValue>({
    //         input,
    //         options,
    //         multiple,
    //         $selectedOptions,
    //       });
    //     },
    //   ),
    // );
    // subscribeOnNodeConnectedTo(this, optionsListener$, noop);
    //
    // const selectedOptionsInputValue$ = selectedOptionsToInputValue<GValue>(selectedOptions$);
    // subscribeOnNodeConnectedTo(this, selectedOptionsInputValue$, $inputValue);
    //
    // /** BINDS **/
    //
    // const [open, close] = createOpenCloseTuple<[HTMLInputElement]>((targetElement: HTMLInputElement): MatSelectOverlayComponent<GValue> => {
    //   return MatOverlayManagerComponent.getInstance()
    //     .open(MatSelectOverlayComponent, [{ targetElement, options$ }]);
    // });
    //
    // subscribeOnNodeConnectedTo(
    //   this,
    //   combineLatest([input$, focused$] as [ISubscribeFunction<HTMLInputElement>, ISubscribeFunction<boolean>]),
    //   ([input, focused]: readonly [HTMLInputElement, boolean]) => {
    //     if (focused) {
    //       open(input);
    //     } else {
    //       close();
    //     }
    //   },
    // );
    //
    // onNodeConnectedToWithImmediateCached(this)((connected: boolean) => {
    //   if (!connected) {
    //     close();
    //   }
    // });

    this._data = {
      $focused,
      $onKeyDown,

      fieldContainerClasses$,
      placeholder$,
      selectValue$,

      $filterInputValue$,

      $onClickClearIcon,

      // $inputValue$,
      // $input,
      // readonly$: _readonly$,
    };
  }

  onCreate(): IData {
    return this._data;
  }

  get options(): IReadonlyNormalizedMatSelectOption<GValue>[] {
    return convertNormalizedMatSelectOptionsToReadonly(this._$options$.getValue());
  }

  set options(options: Iterable<IMatSelectOption<GValue>>) {
    this.setOptions(options);
  }

  setOptions(
    options: Iterable<IMatSelectOption<GValue>>,
  ): void {
    this._$options$.emit(normalizeMatSelectOptions(options));
  }

}
