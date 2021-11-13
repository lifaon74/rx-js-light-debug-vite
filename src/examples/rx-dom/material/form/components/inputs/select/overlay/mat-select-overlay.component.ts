import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, OnCreate,
  onNodeConnectedToWithImmediateCached,
  querySelectorOrThrow, subscribeOnNodeConnectedTo,
} from '@lifaon/rx-dom';
import { IObserver, IObservable, IUnsubscribe, timeout, map$$, $$distinct, let$$ } from '@lifaon/rx-js-light';
// @ts-ignore
import style from './mat-select-overlay.component.scss';
// @ts-ignore
import html from './mat-select-overlay.component.html?raw';
import { ICSSPositionAndSize } from '../../../../../../../misc/types/position-and-size/css-position-and-size.type';
import { MatSimpleOverlayComponent } from '../../../../../overlay/overlay/built-in/simple/mat-simple-overlay.component';
import { MatOverlayManagerComponent } from '../../../../../overlay/overlay/manager/mat-overlay-manager.component';
import {
  IMatSelectInputOption, IMatSelectInputOptionsList, IMatSelectInputReadonlySelectedOptions
} from '../types/mat-select-input-option.type';
import { makeMatOverlayComponentBackdropClosable } from '../../../../../overlay/overlay/component/helpers/make-mat-overlay-component-backdrop-closable';
import { makeMatOverlayComponentClosableWithEscape } from '../../../../../overlay/overlay/component/helpers/make-mat-overlay-component-closable-with-escape';
import { IOverlayCloseOrigin } from '../../../../../overlay/overlay/component/mat-overlay.component';
import { getElementExpectedSize } from '../../../../../overlay/overlay/built-in/simple/helper/get-element-expected-size';
import {
  getPositionAndSizeObservableForSimpleOverlay, IContentElementSizeOptions
} from '../../../../../overlay/overlay/built-in/simple/helper/get-position-and-size-subscribe-function-for-simple-overlay';
import { isOptionSelected } from '../../../../../helpers/options/is-option-selected';
import { toggleOptionSelect } from '../../../../../helpers/options/toggle-option-select';
import { readMultipleObservableValue } from '../../../../../helpers/options/read-multiple-observable-value';
import { readOptionsObservableValue } from '../../../../../helpers/options/read-options-observable-value';
import { readSelectedOptionsObservableValue } from '../../../../../helpers/options/read-selected-options-observable-value';
import { findDOMElement } from '../../../../../../../misc/find-dom-element';
import { eventPreventDefault } from '../../../../../../../misc/event-prevent-default';
import { toggleOptionSelectWithResolvers } from '../../../../../helpers/options/toggle-option-select-with-resolvers';


/** TYPE **/

type IActiveOption<GValue> = IMatSelectInputOption<GValue> | null;

/** COMPONENT **/

export interface IMatSelectOverlayComponentOnClickOption<GValue> {
  (option: IMatSelectInputOption<GValue>): void;
}

export interface IMatSelectOverlayComponentOptions<GValue> {
  readonly targetElement: HTMLElement;
  readonly $close: IObserver<void>;
  readonly options$: IObservable<IMatSelectInputReadonlySelectedOptions<GValue>>;
  readonly selectedOptions$: IObservable<IMatSelectInputReadonlySelectedOptions<GValue>>;
  readonly $rawSelectedOptions: IObserver<IMatSelectInputOptionsList<GValue>>;
  readonly multiple$: IObservable<boolean>;
}


interface IData<GValue> {
  readonly $onFocusOut: IObserver<Event>;
  readonly $onKeyDownOptionsList: IObserver<KeyboardEvent>;
  readonly options$: IObservable<IMatSelectInputReadonlySelectedOptions<GValue>>;
  readonly $onClickOption: IMatSelectOverlayComponentOnClickOption<GValue>;
  readonly isOptionSelected: (option: IMatSelectInputOption<GValue>) => IObservable<boolean>;
  readonly isOptionActive: (option: IMatSelectInputOption<GValue>) => IObservable<boolean>;
}

@Component({
  name: 'mat-select-input-overlay',
  template: compileReactiveHTMLAsGenericComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatSelectInputOverlayComponent<GValue> extends MatSimpleOverlayComponent implements OnCreate<IData<GValue>> {
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


    super(manager, positionAndSize$);

    makeMatOverlayComponentBackdropClosable(this);
    makeMatOverlayComponentClosableWithEscape(this);


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
      } else if (event.key === 'Enter') {
        eventPreventDefault(event);
        const activeOption: IMatSelectInputOption<GValue> | null = getActiveOptionValue();
        if (activeOption !== null) {
          $onClickOption(activeOption);
        }
      }
    };

    const $onClickOption = (option: IMatSelectInputOption<GValue>): void => {
      toggleOptionSelectWithResolvers({
        selectedOptions$,
        $rawSelectedOptions: $rawSelectedOptions,
        option,
        multiple$,
      });

      const multiple: boolean = readMultipleObservableValue(multiple$);

      if (!multiple) {
        this.close();
      }
    };

    this.data = {
      $onFocusOut,
      $onKeyDownOptionsList,
      options$,
      $onClickOption,
      isOptionSelected: _isOptionSelected,
      isOptionActive,
    };
  }

  onCreate(): IData<GValue> {
    return this.data;
  }

  override close(origin?: IOverlayCloseOrigin): Promise<void> {
    this.$close();
    return super.close(origin);
  }

  // TODO
  // override onInit(): void {
  //   super.onInit();
  //   querySelectorOrThrow<HTMLElement>(this, '.options').focus();
  // }
}


/** FUNCTIONS **/

function getPositionAndSizeObservableForMatSelectInputOverlay<GValue>(
  getContainerElement: () => MatSelectInputOverlayComponent<GValue>,
  targetElement: HTMLElement,
): IObservable<ICSSPositionAndSize> {
  return getPositionAndSizeObservableForSimpleOverlay({
    getContainerElement,
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

function focusFirstActiveOption<GValue>(
  optionsSet: IMatSelectInputReadonlySelectedOptions<GValue>,
  selectedOptions$: IObservable<IMatSelectInputReadonlySelectedOptions<GValue>>,
  $activeOption: IObserver<IActiveOption<GValue>>,
): void {
  const selectedOptions: IMatSelectInputReadonlySelectedOptions<GValue> = readSelectedOptionsObservableValue(selectedOptions$);
  let activeOption: IActiveOption<GValue> = null;

  const iterator: Iterator<IMatSelectInputOption<GValue>> = optionsSet.values();
  let result: IteratorResult<IMatSelectInputOption<GValue>>;
  while (!(result = iterator.next()).done) {
    const option: IMatSelectInputOption<GValue> = result.value;
    if (selectedOptions.has(option)) {
      activeOption = option;
      break;
    }
  }

  $activeOption(activeOption);
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


