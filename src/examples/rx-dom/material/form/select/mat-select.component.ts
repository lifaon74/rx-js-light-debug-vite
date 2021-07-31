import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, generateGetNodeModifierFunctionFromArray, HTMLElementConstructor, OnCreate,
  onNodeConnectedToWithImmediateCached, subscribeOnNodeConnectedTo,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-select.component.html?raw';
// @ts-ignore
import style from './mat-select.component.scss';
import { havingMultipleSubscribeFunctionProperties } from '../../../../misc/having-multiple-subscribe-function-properties';
import { createHigherOrderVariable } from '../../../../misc/create-higher-order-variable';
import { let$$, letU$$, map$$, mergeMapS$$ } from '@lifaon/rx-js-light-shortcuts';
import { INPUT_VALUE_MODIFIER } from '../modifiers/input-value.modifier';
import {
  combineLatest, freeze, IEmitFunction, IMulticastReplayLastSource, ISubscribeFunction, IUnsubscribeFunction, merge,
  mergeUnsubscribeFunctions, noop, single
} from '@lifaon/rx-js-light';
import { NODE_REFERENCE_MODIFIER } from '../modifiers/node-reference.modifier';
import { focusSubscribeFunction } from '../../helpers/focus-subscribe-function';
import { MatOverlayManagerComponent } from '../../overlay/overlay/manager/mat-overlay-manager.component';
import { MatSelectOverlayComponent } from './overlay/mat-select-overlay.component';
import { createOpenCloseTuple } from '../../overlay/overlay/component/helpers/create-open-close-tuple';
import {
  IMatSelectOption, INormalizedMatSelectOption, IReadonlyNormalizedMatSelectOption
} from './types/mat-select-option.type';


// function toggleMatSelectOptionSelected(
//   $options$: IReplayLastSource<ISubscribeFunction<IMatSelectOptions>, IGenericSource>,
//   index: number,
//   selected?: boolean,
// ): void {
//   const options: IMatSelectOptions = readSubscribeFunctionValue($options$.getValue(), (): IMatSelectOptions => {
//     throw new Error(`Unable to read options`);
//   });
//
//   if (selected === void 0) {
//     selected = !options[index].selected;
//   }
//
//   $options$.emit(single([
//     ...options.slice(0, index),
//     {
//       ...options[index],
//       selected,
//     },
//     ...options.slice(index + 1),
//   ]));
// }
//
// function toggleMatSelectOptionSelectedInPlace(
//   $options$: IReplayLastSource<ISubscribeFunction<IMatSelectOptions>, IGenericSource>,
//   index: number,
//   selected?: boolean,
// ): void {
//   const options: IMatSelectOptions = readSubscribeFunctionValue($options$.getValue(), (): IMatSelectOptions => {
//     throw new Error(`Unable to read options`);
//   });
//
//   (options[index] as any).selected = (selected === void 0)
//     ? !options[index].selected
//     : selected;
//   $options$.emit(single(options));
// }

// function toggleMatSelectOptionSelected<GValue>(
//   options: IMatSelectOptions<GValue>,
//   index: number,
//   selected: boolean = !options[index].selected,
// ): IMatSelectOptions<GValue> {
//   return [
//     ...options.slice(0, index),
//     {
//       ...options[index],
//       selected,
//     },
//     ...options.slice(index + 1),
//   ];
// }
//
// function toggleMatSelectOptionSelectedInPlace<GValue>(
//   options: IMatSelectOptions<GValue>,
//   index: number,
//   selected: boolean = !options[index].selected,
// ): IMatSelectOptions<GValue> {
//   (options[index] as any).selected = (selected === void 0)
//     ? !options[index].selected
//     : selected;
//   return options;
// }

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
): readonly IReadonlyNormalizedMatSelectOption<GValue>[] {
  return options.map((option: INormalizedMatSelectOption<GValue>): IReadonlyNormalizedMatSelectOption<GValue> => {
    return {
      label$: option.label$,
      value: option.value,
      selected$: option.$selected$.subscribe,
      disabled$: option.disabled$,
    }
  });
}

// function normalizeMatSelectOption<GValue>(
//   options: Iterable<IMatSelectOption<GValue>>,
// ): INormalizedMatSelectOption<GValue>[] {
//   return Array.from(
//     options,
//     (option: IMatSelectOption<GValue>): INormalizedMatSelectOption<GValue> => {
//       // const $selected$: IMulticastReplayLastSource<ISubscribeFunction<boolean>> = let$$<ISubscribeFunction<boolean>>(
//       //   (option.selected$ === void 0)
//       //     ? single(false)
//       //     : option.selected$,
//       // );
//       // const selected$ = mergeAllS$$($selected$.subscribe);
//       //
//       // const $selected = (value: boolean) => {
//       //   $selected$.emit(single(value));
//       // };
//
//       const $selected$: IMulticastReplayLastSource<boolean> = let$$<boolean>(false);
//       const selected$: ISubscribeFunction<boolean> = (option.selected$ === void 0)
//         ? $selected$.subscribe
//         : merge([$selected$.subscribe, option.selected$]);
//       const $selected = $selected$.emit;
//
//       return {
//         label$: option.label$,
//         value: option.value,
//         disabled$: option.disabled$ ?? single(false),
//         get selected(): boolean {
//           return $selected$.getValue();
//         },
//         set selected(value: boolean) {
//           $selected(value);
//         },
//         selected$,
//         $selected,
//       };
//     },
//   );
// }


// function fixMatSelectComponentOptionsWithoutMultiple<GValue>(
//   options: INormalizedMatSelectOption<GValue>[],
// ): boolean {
//   let changed: boolean = false;
//   let foundSelectedOption: boolean = false;
//
//   for (let i = 0, l = options.length; i < l; i++) {
//     const option: INormalizedMatSelectOption<GValue> = options[i];
//     if (option.selected) {
//       if (foundSelectedOption) {
//         option.selected = false;
//         changed = true;
//       } else {
//         foundSelectedOption = true;
//       }
//     }
//   }
//
//   return changed;
// }
//
//
// function toggleMatSelectOptionSelected<GValue>(
//   multiple: boolean,
//   options: INormalizedMatSelectOption<GValue>[],
//   option: INormalizedMatSelectOption<GValue>,
//   selected?: boolean,
// ): boolean {
//   return multiple
//     ? toggleMatSelectOptionSelectedWithMultiple(options, option, selected)
//     : toggleMatSelectOptionSelectedWithoutMultiple(options, option, selected);
// }
//
//
// function toggleMatSelectOptionSelectedWithMultiple<GValue>(
//   options: INormalizedMatSelectOption<GValue>[],
//   option: INormalizedMatSelectOption<GValue>,
//   selected: boolean = !option.selected,
// ): boolean {
//   const changed: boolean = (option.selected !== selected);
//   if (changed) {
//     option.id = getMatSelectOptionUUID();
//     option.selected = selected;
//   }
//   return changed;
// }
//
// function toggleMatSelectOptionSelectedWithoutMultiple<GValue>(
//   options: INormalizedMatSelectOption<GValue>[],
//   option: INormalizedMatSelectOption<GValue>,
//   selected: boolean = !option.selected,
// ): boolean {
//   let changed: boolean = false;
//
//   for (let i = 0, l = options.length; i < l; i++) {
//     const _option: INormalizedMatSelectOption<GValue> = options[i];
//     const _selected: boolean = (_option === option) && selected;
//     if (_option.selected !== _selected) {
//       _option.selected = _selected;
//       _option.id = getMatSelectOptionUUID();
//       changed = true;
//     }
//   }
//
//   return changed;
// }


/** COMPONENT **/

type IMatSelectComponentInputs<GValue> = [
  ['multiple', boolean],
];


interface IData {
  $inputValue$: IMulticastReplayLastSource<string>;
  $input: IEmitFunction<HTMLInputElement>;
}

const MAT_SELECT_MODIFIERS = [
  INPUT_VALUE_MODIFIER,
  NODE_REFERENCE_MODIFIER,
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
  protected readonly _$options$: IMulticastReplayLastSource<INormalizedMatSelectOption<GValue>[]>;
  protected readonly _data: IData;

  constructor() {
    const [$multiple$, multiple$] = createHigherOrderVariable<boolean>(false);

    super([
      ['multiple', $multiple$],
    ]);

    const $options$ = let$$<INormalizedMatSelectOption<GValue>[]>([]);
    this._$options$ = $options$;
    const options$ = $options$.subscribe;

    const $inputValue$ = let$$<string>('');

    const { emit: $input, subscribe: input$ } = letU$$<HTMLInputElement>();

    const focused$ = mergeMapS$$(input$, focusSubscribeFunction);
    // TODO share ?
    // TODO debounce ?

    /** OPTIONS **/

    const selected$ = mergeMapS$$(
        combineLatest<[typeof options$, typeof multiple$]>([options$, multiple$]),
        ([options, multiple]: readonly [INormalizedMatSelectOption<GValue>[], boolean]): ISubscribeFunction<never> => {
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
                  });
                }
              )
            );
          };
        },
      );

    subscribeOnNodeConnectedTo(this, selected$, noop);

    /** BINDS **/

    const [open, close] = createOpenCloseTuple<[HTMLInputElement]>((targetElement: HTMLInputElement): MatSelectOverlayComponent<GValue> => {
      return MatOverlayManagerComponent.getInstance()
        .open(MatSelectOverlayComponent, [{ targetElement, options$ }]);
    });

    subscribeOnNodeConnectedTo(
      this,
      combineLatest([input$, focused$] as [ISubscribeFunction<HTMLInputElement>, ISubscribeFunction<boolean>]),
      ([input, focused]: readonly [HTMLInputElement, boolean]) => {
        if (focused) {
          open(input);
        } else {
          // close();
        }
      },
    );

    onNodeConnectedToWithImmediateCached(this)((connected: boolean) => {
      if (!connected) {
        close();
      }
    });


    this._data = {
      $inputValue$,
      $input,
    };
  }

  onCreate(): IData {
    return this._data;
  }

  get options(): readonly IReadonlyNormalizedMatSelectOption<GValue>[] {
    return convertNormalizedMatSelectOptionsToReadonly(this._$options$.getValue());
  }

  set options(options: Iterable<IMatSelectOption<GValue>>) {
    this.setOptions(options);
  }

  get options$(): ISubscribeFunction<readonly IReadonlyNormalizedMatSelectOption<GValue>[]> {
    return map$$(this._$options$.subscribe, convertNormalizedMatSelectOptionsToReadonly);
  }

  setOptions(
    options: Iterable<IMatSelectOption<GValue>>,
  ): void {
    this._$options$.emit(normalizeMatSelectOptions(options));
  }

}
