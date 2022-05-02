import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsComponentTemplate, Component, OnCreate,
  subscribeOnNodeConnectedTo,
} from '@lirx/dom';
import {
  $$distinct, combineLatest, IObservable, IObserver, IUnsubscribe, let$$, map$$, timeout,
} from '@lirx/core';
// @ts-ignore
import style from './mat-select-overlay.component.scss';
// @ts-ignore
import html from './mat-select-overlay.component.html?raw';
import { ICSSPositionAndSize } from '../../../../../../../misc/types/position-and-size/css-position-and-size.type';
import { MatSimpleOverlayComponent } from '../../../../../overlay/overlay/built-in/simple/mat-simple-overlay.component';
import { MatOverlayManagerComponent } from '../../../../../overlay/overlay/manager/mat-overlay-manager.component';
import {
  IMatSelectInputOption, IMatSelectInputOptionsList, IMatSelectInputReadonlyOptions,
  IMatSelectInputReadonlySelectedOptions,
} from '../types/mat-select-input-option.type';
import {
  makeMatOverlayComponentBackdropClosable,
} from '../../../../../overlay/overlay/__component/helpers/make-mat-overlay-component-backdrop-closable';
import {
  makeMatOverlayComponentClosableWithEscape,
} from '../../../../../overlay/overlay/__component/helpers/make-mat-overlay-component-closable-with-escape';
import {
  IOverlayCloseOrigin, MatOverlayComponent,
} from '../../../../../overlay/overlay/__component/mat-overlay.component';
import {
  getElementExpectedSize,
} from '../../../../../overlay/overlay/built-in/simple/helper/get-element-expected-size';
import {
  getPositionAndSizeObservableForSimpleOverlay,
} from '../../../../../overlay/overlay/built-in/simple/helper/get-position-and-size-subscribe-function-for-simple-overlay';
import { isOptionSelected } from '../../../../../helpers/options/is-option-selected';
import { readMultipleObservableValue } from '../../../../../helpers/options/read-multiple-observable-value';
import { readOptionsObservableValue } from '../../../../../helpers/options/read-options-observable-value';
import {
  readSelectedOptionsObservableValue,
} from '../../../../../helpers/options/read-selected-options-observable-value';
import { findDOMElement } from '../../../../../../../misc/find-dom-element';
import { eventPreventDefault } from '../../../../../../../misc/event-prevent-default';
import { toggleOptionSelectWithResolvers } from '../../../../../helpers/options/toggle-option-select-with-resolvers';
import { isEnterOrSpace } from '../../../../../helpers/is-enter-or-space';
import {
  toggleMultipleOptionsSelectWithResolvers,
} from '../../../../../helpers/options/toggle-multiple-options-select-with-resolvers';
import {
  MatPositionedOverlayContentComponent
} from '../../../../../overlay/overlay/built-in/positioned-overlay-content/mat-positioned-overlay-content.component';
import { applyCSSPositionAndSize } from '../../../../../../../misc/types/position-and-size/apply-css-position-and-size';
import { isElementOrChildrenFocusedObservableDebounced } from '../../../../../helpers/focus-observable';
import {
  getPositionAndSizeObservableForOverlayNearTargetElement, IContentElementSizeOptions,
} from '../../../../../overlay/overlay/built-in/simple/helper/get-position-and-size-observable-for-overlay-near-target-element';


/** TYPE **/

type IActiveOption<GValue> = IMatSelectInputOption<GValue> | null;

/** COMPONENT **/

export interface IMatSelectOverlayComponentOnClickOption<GValue> {
  (option: IMatSelectInputOption<GValue>, event?: MouseEvent): void;
}

export interface IMatSelectOverlayComponentOptions<GValue> {
  readonly targetElement: HTMLElement;
  readonly $close: IObserver<void>;
  readonly options$: IObservable<IMatSelectInputReadonlyOptions<GValue>>;
  readonly selectedOptions$: IObservable<IMatSelectInputReadonlySelectedOptions<GValue>>;
  readonly $rawSelectedOptions: IObserver<IMatSelectInputOptionsList<GValue>>;
  readonly multiple$: IObservable<boolean>;
}


interface IData<GValue> {
  readonly $onFocusOut: IObserver<Event>;
  readonly $onKeyDownOptionsList: IObserver<KeyboardEvent>;
  readonly options$: IObservable<IMatSelectInputReadonlySelectedOptions<GValue>>;
  readonly onClickOption: IMatSelectOverlayComponentOnClickOption<GValue>;
  readonly isOptionSelected: (option: IMatSelectInputOption<GValue>) => IObservable<boolean>;
  readonly isOptionActive: (option: IMatSelectInputOption<GValue>) => IObservable<boolean>;
}

@Component({
  name: 'mat-select-input-overlay',
  template: compileReactiveHTMLAsComponentTemplate({
    html,
    customElements: [
      MatPositionedOverlayContentComponent,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatSelectInputOverlayComponent<GValue> extends MatOverlayComponent implements OnCreate<IData<GValue>> {
  protected readonly data: IData<GValue>;
  protected readonly $close: IObserver<void>;

  constructor(
    manager: MatOverlayManagerComponent,
    {
      targetElement,
      $close,
      options$,
      selectedOptions$,
      $rawSelectedOptions,
      multiple$,
    }: IMatSelectOverlayComponentOptions<GValue>,
  ) {

    const positionAndSize$: IObservable<ICSSPositionAndSize> = getPositionAndSizeObservableForMatSelectInputOverlay<GValue>(
      () => this,
      targetElement,
    );


    super(manager);
    // super(manager, positionAndSize$);

    // makeMatOverlayComponentBackdropClosable(this);
    // makeMatOverlayComponentClosableWithEscape(this);

    // subscribeOnNodeConnectedTo(
    //   this,
    //   positionAndSize$,
    //   (positionAndSize: ICSSPositionAndSize) => {
    //     applyCSSPositionAndSize(this, positionAndSize);
    //   },
    // );
    //
    // subscribeOnNodeConnectedTo(
    //   this,
    //   isElementOrChildrenFocusedObservableDebounced(this),
    //   (focused: boolean) => {
    //     if (!focused) {
    //       this.close();
    //       // TODO continue HERE => migrating SimpleOverlay to something more "common"
    //     }
    //   },
    // );
    //
    // queueMicrotask(() => {
    //   this.tabIndex = 0;
    //   this.focus();
    // })

    /** VARIABLES **/

    this.$close = $close;


    const _isOptionSelected = (option: IMatSelectInputOption<GValue>): IObservable<boolean> => {
      return isOptionSelected({
        selectedOptions$,
        option,
      });
    };


    /* ACTIVE OPTION */

    const {
      emit: _$activeOption,
      subscribe: activeOption$,
      getValue: getActiveOptionValue,
    } = let$$<IActiveOption<GValue>>(null);

    const $activeOption = $$distinct(_$activeOption);

    // if options change, reset activeOption
    subscribeOnNodeConnectedTo(this, options$, (optionsSet: IMatSelectInputReadonlySelectedOptions<GValue>): void => {
      // $activeOption(null);
      focusFirstActiveOption(
        optionsSet,
        selectedOptions$,
        $activeOption,
      );
    });

    subscribeOnNodeConnectedTo(this, activeOption$, (activeOption: IActiveOption<GValue>): void => {
      scrollToActiveOption(
        this,
        activeOption,
        options$,
      );
    });

    const isOptionActive = (option: IMatSelectInputOption<GValue>): IObservable<boolean> => {
      return map$$(activeOption$, (activeOption: IActiveOption<GValue>): boolean => {
        return (option === activeOption);
      });
    };

    /** EVENTS **/

    const $onFocusOut = (): void => {
      this.close();
    };

    const $onKeyDownOptionsList = (event: KeyboardEvent): void => {
      if (event.key === 'ArrowDown') {
        eventPreventDefault(event);
        focusNextActiveOption(
          getActiveOptionValue,
          options$,
          $activeOption,
        );
      } else if (event.key === 'ArrowUp') {
        eventPreventDefault(event);
        focusPreviousActiveOption(
          getActiveOptionValue,
          options$,
          $activeOption,
        );
      } else if (isEnterOrSpace(event)) {
        eventPreventDefault(event);
        const activeOption: IMatSelectInputOption<GValue> | null = getActiveOptionValue();
        if (activeOption !== null) {
          onClickOption(activeOption);
        }
      }
    };

    const onClickOption = (option: IMatSelectInputOption<GValue>, event?: MouseEvent): void => {
      const multiple: boolean = readMultipleObservableValue(multiple$);

      if (
        multiple
        && (event !== void 0)
        && event.shiftKey
      ) {
        const optionsSet: IMatSelectInputReadonlyOptions<GValue> = readOptionsObservableValue(options$);
        const activeOption: IActiveOption<GValue> = getFirstActiveOption<GValue>(optionsSet, selectedOptions$);

        if (activeOption !== null) {
          const options: IMatSelectInputOption<GValue>[] = getOptionsBetween<GValue>(
            activeOption,
            option,
            optionsSet,
          );

          if (options.length > 1) {
            toggleMultipleOptionsSelectWithResolvers<IMatSelectInputOption<GValue>>({
              selectedOptions$,
              $rawSelectedOptions: $rawSelectedOptions,
              options,
              multiple$,
              select: true,
            });
          } else {
            toggleOptionSelectWithResolvers<IMatSelectInputOption<GValue>>({
              selectedOptions$,
              $rawSelectedOptions: $rawSelectedOptions,
              option,
              multiple$,
            });
          }
        }
      } else {
        toggleOptionSelectWithResolvers<IMatSelectInputOption<GValue>>({
          selectedOptions$,
          $rawSelectedOptions: $rawSelectedOptions,
          option,
          multiple$,
        });
      }

      if (multiple) {
        $activeOption(option);
      } else {
        this.close();
      }
    };


    // const unsubscribeOfFindOptionsContainer = subscribeOnNodeConnectedTo(
    //   this,
    //   findDOMElement('.content > .options', this),
    //   (element: HTMLElement | null): void => {
    //     if (element !== null) {
    //       unsubscribeOfFindOptionsContainer();
    //       element.focus();
    //     }
    //   },
    // );

    this.data = {
      $onFocusOut,
      $onKeyDownOptionsList,
      options$,
      onClickOption,
      isOptionSelected: _isOptionSelected,
      isOptionActive,
    };
  }

  onCreate(): IData<GValue> {
    return this.data;
  }

  // override close(origin?: IOverlayCloseOrigin): Promise<void> {
  //   this.$close();
  //   return super.close(origin);
  // }
}


/** FUNCTIONS **/

function getPositionAndSizeObservableForMatSelectInputOverlay<GValue>(
  getContentElement: () => MatSelectInputOverlayComponent<GValue>,
  targetElement: HTMLElement,
): IObservable<ICSSPositionAndSize> {
  return getPositionAndSizeObservableForOverlayNearTargetElement({
    getContentElement: getContentElement,
    targetElement,
    getContentElementSize: (
      {
        contentElement,
        targetElementPositionAndSize,
      }: IContentElementSizeOptions,
    ) => {
      return getElementExpectedSize(
        contentElement,
        { width: targetElementPositionAndSize.width },
      );
    },
  });
}

/** FUNCTIONS **/

function getOptionsBetween<GValue>(
  optionA: IMatSelectInputOption<GValue>,
  optionB: IMatSelectInputOption<GValue>,
  optionsSet: IMatSelectInputReadonlyOptions<GValue>,
): IMatSelectInputOption<GValue>[] {
  const options: IMatSelectInputOption<GValue>[] = [];
  let between: boolean = false;

  const iterator: Iterator<IMatSelectInputOption<GValue>> = optionsSet.values();
  let result: IteratorResult<IMatSelectInputOption<GValue>>;
  while (!(result = iterator.next()).done) {
    const option: IMatSelectInputOption<GValue> = result.value;
    if (
      (option === optionA)
      || (option === optionB)
    ) {
      between = !between;
    }

    if (between) {
      options.push(option);
    }
  }

  return options;
}

/** FUNCTIONS **/

const SCROLL_TO_ACTIVE_OPTION_SUBSCRIPTIONS = new WeakMap<MatSelectInputOverlayComponent<any>, IUnsubscribe>();

/**
 * TODO Pretty ugly
 */
function scrollToActiveOption<GValue>(
  element: MatSelectInputOverlayComponent<GValue>,
  activeOption: IActiveOption<GValue>,
  optionsSet$: IObservable<IMatSelectInputReadonlySelectedOptions<GValue>>,
): void {
  if (SCROLL_TO_ACTIVE_OPTION_SUBSCRIPTIONS.has(element)) {
    (SCROLL_TO_ACTIVE_OPTION_SUBSCRIPTIONS.get(element) as IUnsubscribe)();
  }
  if (activeOption !== null) {
    const selector: string = `:scope > .content > .options > [index="${getOptionIndex(activeOption, optionsSet$)}"]`;

    const clear = () => {
      unsubscribeOfFindDOMElement();
      unsubscribeOfTimeout();
    };

    const unsubscribeOfFindDOMElement = findDOMElement(selector, element)((optionElement: HTMLElement | null): void => {
      if (optionElement !== null) {
        optionElement.scrollIntoView({
          block: 'nearest',
        });
        clear();
      }
    });

    const unsubscribeOfTimeout = timeout(500)(clear);

    // onNodeConnectedToWithImmediateCached(element)((connected: boolean) => {
    //   if (!connected) {
    //     clear();
    //   }
    // });
  }
}

function getOptionIndex<GValue>(
  option: IMatSelectInputOption<GValue>,
  optionsSet$: IObservable<IMatSelectInputReadonlySelectedOptions<GValue>>,
): number {
  const optionsSet = readOptionsObservableValue(optionsSet$);
  let i: number = 0;
  const iterator: Iterator<IMatSelectInputOption<GValue>> = optionsSet.values();
  let result: IteratorResult<IMatSelectInputOption<GValue>>;
  while (!(result = iterator.next()).done) {
    const _option: IMatSelectInputOption<GValue> = result.value;
    if (_option === option) {
      return i;
    } else {
      i++;
    }
  }
  return -1;
}

function getFirstActiveOption<GValue>(
  optionsSet: IMatSelectInputReadonlySelectedOptions<GValue>,
  selectedOptions$: IObservable<IMatSelectInputReadonlySelectedOptions<GValue>>,
): IActiveOption<GValue> | null {
  const selectedOptions: IMatSelectInputReadonlySelectedOptions<GValue> = readSelectedOptionsObservableValue(selectedOptions$);
  let activeOption: IActiveOption<GValue> | null = null;

  const iterator: Iterator<IMatSelectInputOption<GValue>> = optionsSet.values();
  let result: IteratorResult<IMatSelectInputOption<GValue>>;
  while (!(result = iterator.next()).done) {
    const option: IMatSelectInputOption<GValue> = result.value;
    if (selectedOptions.has(option)) {
      activeOption = option;
      break;
    }
  }

  return activeOption;
}

function focusFirstActiveOption<GValue>(
  optionsSet: IMatSelectInputReadonlySelectedOptions<GValue>,
  selectedOptions$: IObservable<IMatSelectInputReadonlySelectedOptions<GValue>>,
  $activeOption: IObserver<IActiveOption<GValue>>,
): void {
  $activeOption(getFirstActiveOption<GValue>(optionsSet, selectedOptions$));
}

function focusNextActiveOption<GValue>(
  getActiveOptionValue: () => IActiveOption<GValue>,
  optionsSet$: IObservable<IMatSelectInputReadonlySelectedOptions<GValue>>,
  $activeOption: IObserver<IActiveOption<GValue>>,
): void {
  const activeOption: IActiveOption<GValue> = getActiveOptionValue();
  const optionsSet = readOptionsObservableValue(optionsSet$);
  const iterator: Iterator<IMatSelectInputOption<GValue>> = optionsSet.values();

  if (activeOption !== null) {
    let result: IteratorResult<IMatSelectInputOption<GValue>>;
    while (!(result = iterator.next()).done) {
      if (result.value === activeOption) {
        break;
      }
    }
  }

  let nextActiveOptionResult: IteratorResult<IMatSelectInputOption<GValue>> = iterator.next();
  if (nextActiveOptionResult.done) {
    nextActiveOptionResult = optionsSet.values().next();
  }

  const nextActiveOption: IActiveOption<GValue> = nextActiveOptionResult.done
    ? null
    : nextActiveOptionResult.value;

  $activeOption(nextActiveOption);
}

function focusPreviousActiveOption<GValue>(
  getActiveOptionValue: () => IActiveOption<GValue>,
  optionsSet$: IObservable<IMatSelectInputReadonlySelectedOptions<GValue>>,
  $activeOption: IObserver<IActiveOption<GValue>>,
): void {
  const activeOption: IActiveOption<GValue> = getActiveOptionValue();
  const optionsSet = readOptionsObservableValue(optionsSet$);
  const iterator: Iterator<IMatSelectInputOption<GValue>> = optionsSet.values();

  let previousActiveOption: IActiveOption<GValue> = null;

  let result: IteratorResult<IMatSelectInputOption<GValue>>;
  while (!(result = iterator.next()).done) {
    const option: IMatSelectInputOption<GValue> = result.value;
    if (
      (option === activeOption)
      && (previousActiveOption !== null)
    ) {
      break;
    } else {
      previousActiveOption = option;
    }
  }

  $activeOption(previousActiveOption);
}


