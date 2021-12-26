import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, IDynamicStyleValue,
  OnCreate, querySelectorAll, querySelectorOrThrow, setReactiveClass, subscribeOnNodeConnectedTo,
} from '@lifaon/rx-dom';
import { andM$$, debounceFrame$$, fromEventTarget, IObservable, IObserver, map$$, single } from '@lifaon/rx-js-light';
// @ts-ignore
import style from './mat-color-input-overlay.component.scss?inline';
// @ts-ignore
import html from './mat-color-input-overlay.component.html?raw';
import { ICSSPositionAndSize } from '../../../../../../../misc/types/position-and-size/css-position-and-size.type';
import { MatSimpleOverlayComponent } from '../../../../../overlay/overlay/built-in/simple/mat-simple-overlay.component';
import { MatOverlayManagerComponent } from '../../../../../overlay/overlay/manager/mat-overlay-manager.component';
import { IPositionAndSize } from '../../../../../../../misc/types/position-and-size/position-and-size.type';
import { getElementPositionAndSize } from '../../../../../../../misc/types/position-and-size/get-element-position-and-size';
import { IReadonlyHSVAColor } from '../../../../../../../misc/css/color/colors/hsva/hsva-color.type';
import { DEFAULT_MAT_COLOR_INPUT_COLOR } from '../misc/default-mat-color-input-color.constant';
import { createHSVAColor } from '../../../../../../../misc/css/color/colors/hsva/create-hsva-color';
import { createHSLAColor } from '../../../../../../../misc/css/color/colors/hsla/create-hsla-color';
import { hslaColorToHexString } from '../../../../../../../misc/css/color/colors/hsla/to/string/hsla-color-to-hex-string';
import { IHSLAColor } from '../../../../../../../misc/css/color/colors/hsla/hsla-color.type';
import { hsvaColorToHexString } from '../../../../../../../misc/css/color/colors/hsva/to/string/hsva-color-to-hex-string';
import { mathClamp } from '../../../../../../../misc/math/clamp';
import { makeMatOverlayComponentBackdropClosable } from '../../../../../overlay/overlay/__component/helpers/make-mat-overlay-component-backdrop-closable';
import { makeMatOverlayComponentClosableWithEscape } from '../../../../../overlay/overlay/__component/helpers/make-mat-overlay-component-closable-with-escape';
import { IOverlayCloseOrigin } from '../../../../../overlay/overlay/__component/mat-overlay.component';
import {
  getEyeDropperConstructor, IColorSelectionResult, IEyeDropper, isEyeDropperAvailable
} from '../misc/eye-dropper';
import { colorStringToColor } from '../misc/color-string-to-color';
import { colorToHSVAColor } from '../../../../../../../misc/css/color/to/color-to-hsva-color';
import { isElementVisible } from '../../../../../../../misc/is-element-visible';
import { getPositionAndSizeObservableForSimpleOverlay } from '../../../../../overlay/overlay/built-in/simple/helper/get-position-and-size-subscribe-function-for-simple-overlay';
import { findDOMElement } from '../../../../../../../misc/find-dom-element';


/** FUNCTION **/

function generateHueGradient(
  steps: number = 16,
): string {
  const colorStops: string[] = [];
  const color: IHSLAColor = createHSLAColor(0, 1, 0.5, 1);

  for (let i = 0; i <= steps; i++) {
    const h: number = i / steps;
    color.h = h;
    colorStops.push(`${ hslaColorToHexString(color).slice(0, -2) } ${ (h * 100) }%`);
  }

  return `linear-gradient(to bottom, ${ colorStops.join(', ') })`;
}

// console.log(generateHueGradient());

/** COMPONENT **/


export interface IMatColorInputOverlayComponentOptions {
  readonly targetElement: HTMLElement;
  readonly $close: IObserver<void>;
  readonly $hsvaColor: IObserver<IReadonlyHSVAColor>;
  readonly hsvaColor$: IObservable<IReadonlyHSVAColor>;
  readonly alphaDisabled$: IObservable<boolean>;
}


interface IData {
  // SUBSCRIBE FUNCTIONS
  // saturation and value
  readonly saturationAndValueSelectElementBackgroundColor$: IObservable<IDynamicStyleValue>;
  readonly saturationAndValueSelectCursorElementLeft$: IObservable<IDynamicStyleValue>;
  readonly saturationAndValueSelectCursorElementTop$: IObservable<IDynamicStyleValue>;
  // hue
  readonly hueSelectCursorElementTop$: IObservable<IDynamicStyleValue>;
  // alpha
  readonly alphaSelectElementBackgroundGradient$: IObservable<IDynamicStyleValue>;
  readonly alphaSelectCursorElementTop$: IObservable<IDynamicStyleValue>;
  //
  // EMIT FUNCTIONS
  // saturation and value
  readonly $onPointerDownSaturationAndValueSelect: IObserver<PointerEvent>;
  readonly $onKeyDownSaturationAndValueSelectCursor: IObserver<KeyboardEvent>;
  // hue
  readonly $onPointerDownHueSelect: IObserver<PointerEvent>;
  readonly $onKeyDownHueSelectCursor: IObserver<KeyboardEvent>;
  // alpha
  readonly $onPointerDownAlphaSelect: IObserver<PointerEvent>;
  readonly $onKeyDownAlphaSelectCursor: IObserver<KeyboardEvent>;
  // color picker
  readonly $onClickColorPicker: IObserver<MouseEvent>;
  readonly $onKeyDownColorPicker: IObserver<KeyboardEvent>;
  // others
  readonly $onFocusFirst: IObserver<FocusEvent>;
  readonly $onFocusLast: IObserver<FocusEvent>;
}

@Component({
  name: 'mat-color-input-overlay',
  template: compileReactiveHTMLAsGenericComponentTemplate({ html }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatColorInputOverlayComponent extends MatSimpleOverlayComponent implements OnCreate<IData> {
  protected readonly data: IData;
  protected readonly $close: IObserver<void>;

  constructor(
    manager: MatOverlayManagerComponent,
    {
      targetElement,
      $close,
      $hsvaColor,
      hsvaColor$,
      alphaDisabled$,
    }: IMatColorInputOverlayComponentOptions,
  ) {
    const positionAndSize$: IObservable<ICSSPositionAndSize> = getPositionAndSizeObservableForMatColorInputOverlay(
      () => this,
      targetElement,
    );

    super(manager, positionAndSize$);

    makeMatOverlayComponentBackdropClosable(this);
    makeMatOverlayComponentClosableWithEscape(this);

    this.$close = $close;

    /** REFLECT COLOR ON ELEMENTS **/


    const saturationAndValueSelectElementBackgroundColor$ = map$$(
      hsvaColor$,
      (hsvaColor: IReadonlyHSVAColor): IDynamicStyleValue => hsvaColorToHexString(createHSVAColor(hsvaColor.h, 1, 1, 1)),
    );

    const saturationAndValueSelectCursorElementLeft$ = map$$(
      hsvaColor$,
      (hsvaColor: IReadonlyHSVAColor): IDynamicStyleValue => `${ (hsvaColor.s * 100) }%`,
    );

    const saturationAndValueSelectCursorElementTop$ = map$$(
      hsvaColor$,
      (hsvaColor: IReadonlyHSVAColor): IDynamicStyleValue => `${ ((1 - hsvaColor.v) * 100) }%`,
    );


    const hueSelectCursorElementTop$ = map$$(
      hsvaColor$,
      (hsvaColor: IReadonlyHSVAColor): IDynamicStyleValue => `${ (hsvaColor.h * 100) }%`,
    );

    const alphaSelectElementBackgroundGradient$ = map$$(
      hsvaColor$,
      (hsvaColor: IReadonlyHSVAColor): IDynamicStyleValue => {
        const color: string = hsvaColorToHexString({
          ...hsvaColor,
          a: 1,
        });
        return `linear-gradient(to bottom, ${ color } 0%, transparent 100%)`;
      },
    );

    const alphaSelectCursorElementTop$ = map$$(
      hsvaColor$,
      (hsvaColor: IReadonlyHSVAColor): IDynamicStyleValue => `${ ((1 - hsvaColor.a) * 100) }%`,
    );

    /** EVENTS **/

    let hsvaColor: IReadonlyHSVAColor = DEFAULT_MAT_COLOR_INPUT_COLOR;
    hsvaColor$((_hsvaColor: IReadonlyHSVAColor) => (hsvaColor = _hsvaColor));

    const onPointerDown = (event: Event): HTMLElement => {
      event.stopPropagation();
      event.preventDefault();
      const element: HTMLElement = event.currentTarget as HTMLElement;
      querySelectorOrThrow<HTMLElement>(element, ':scope > .cursor').focus();
      return element;
    };

    // SATURATION AND VALUE

    const $onPointerDownSaturationAndValueSelect = (event: PointerEvent): void => {
      const element: HTMLElement = onPointerDown(event);

      const update = (event: PointerEvent): void => {
        const [s, v] = getSaturationAndValueFromPointerEvent(event, element);
        $hsvaColor({
          ...hsvaColor,
          s,
          v,
        });
      };

      update(event);

      const unsubscribePointerMove = subscribeOnNodeConnectedTo(
        this,
        debounceFrame$$(fromEventTarget<'pointermove', PointerEvent>(window, 'pointermove')),
        update,
      );

      const unsubscribePointerUp = subscribeOnNodeConnectedTo(
        this,
        fromEventTarget<'pointerup', PointerEvent>(window, 'pointerup'),
        (event: PointerEvent): void => {
          update(event);
          unsubscribePointerMove();
          unsubscribePointerUp();
        },
      );
    };

    const $onKeyDownSaturationAndValueSelectCursor = (event: KeyboardEvent): void => {
      const step: number = 0.05;
      if (event.key === 'ArrowDown') {
        $hsvaColor({
          ...hsvaColor,
          v: clampValue(hsvaColor.v - step),
        });
      } else if (event.key === 'ArrowUp') {
        $hsvaColor({
          ...hsvaColor,
          v: clampValue(hsvaColor.v + step),
        });
      } else if (event.key === 'ArrowLeft') {
        $hsvaColor({
          ...hsvaColor,
          s: clampValue(hsvaColor.s - step),
        });
      } else if (event.key === 'ArrowRight') {
        $hsvaColor({
          ...hsvaColor,
          s: clampValue(hsvaColor.s + step),
        });
      } else if (event.key === 'Enter') {
        this.close();
      }
    };


    // HUE

    const $onPointerDownHueSelect = (event: PointerEvent): void => {
      const element: HTMLElement = onPointerDown(event);

      const update = (event: PointerEvent): void => {
        $hsvaColor({
          ...hsvaColor,
          h: getHueFromPointerEvent(event, element),
        });
      };

      update(event);

      const unsubscribePointerMove = subscribeOnNodeConnectedTo(
        this,
        debounceFrame$$(fromEventTarget<'pointermove', PointerEvent>(window, 'pointermove')),
        update,
      );

      const unsubscribePointerUp = subscribeOnNodeConnectedTo(
        this,
        fromEventTarget<'pointerup', PointerEvent>(window, 'pointerup'),
        (event: PointerEvent): void => {
          update(event);
          unsubscribePointerMove();
          unsubscribePointerUp();
        },
      );
    };

    const $onKeyDownHueSelectCursor = (event: KeyboardEvent): void => {
      const step: number = 0.05;
      if (event.key === 'ArrowDown') {
        $hsvaColor({
          ...hsvaColor,
          h: clampHue(hsvaColor.h + step),
        });
      } else if (event.key === 'ArrowUp') {
        $hsvaColor({
          ...hsvaColor,
          h: clampHue(hsvaColor.h - step),
        });
      } else if (event.key === 'Enter') {
        this.close();
      }
    };

    // ALPHA

    const $onPointerDownAlphaSelect = (event: PointerEvent): void => {
      const element: HTMLElement = onPointerDown(event);

      const update = (event: PointerEvent): void => {
        $hsvaColor({
          ...hsvaColor,
          a: getAlphaFromPointerEvent(event, element),
        });
      };

      update(event);

      const unsubscribePointerMove = subscribeOnNodeConnectedTo(
        this,
        debounceFrame$$(fromEventTarget<'pointermove', PointerEvent>(window, 'pointermove')),
        update,
      );

      const unsubscribePointerUp = subscribeOnNodeConnectedTo(
        this,
        fromEventTarget<'pointerup', PointerEvent>(window, 'pointerup'),
        (event: PointerEvent): void => {
          update(event);
          unsubscribePointerMove();
          unsubscribePointerUp();
        },
      );
    };

    const $onKeyDownAlphaSelectCursor = (event: KeyboardEvent): void => {
      const step: number = 0.05;
      if (event.key === 'ArrowDown') {
        $hsvaColor({
          ...hsvaColor,
          a: clampAlpha(hsvaColor.a - step),
        });
      } else if (event.key === 'ArrowUp') {
        $hsvaColor({
          ...hsvaColor,
          a: clampAlpha(hsvaColor.a + step),
        });
      } else if (event.key === 'Enter') {
        this.close();
      }
    };

    setReactiveClass(alphaDisabled$, this, 'alpha-disabled');


    /** TOOLS **/

    /* COLOR PICKER */

    const colorPickerDisabled$ = single(!isEyeDropperAvailable());

    const pickColor = (): void => {
      const eyeDropper: IEyeDropper = new (getEyeDropperConstructor());
      eyeDropper.open()
        .then(({ sRGBHex }: IColorSelectionResult): void => {
          $hsvaColor({
            ...colorToHSVAColor(colorStringToColor(sRGBHex)),
            a: 1,
          });
        });
    };

    const $onClickColorPicker = pickColor;

    const $onKeyDownColorPicker = (event: KeyboardEvent): void => {
      if (event.key === 'Enter') {
        pickColor();
      }
    };

    const toolsDisabled$ = andM$$(colorPickerDisabled$);

    setReactiveClass(toolsDisabled$, this, 'tools-disabled');

    /** FOCUS **/

      // const { emit: $onFocusFirst, subscribe: focusFirst$ } = combineObservablesWithObserver([
      //   alphaDisabled$,
      //   toolsDisabled$,
      // ] as [IObservable<boolean>, IObservable<boolean>]);
      //
      // const getLastElementFocusableSelector = ([alphaDisabled, toolsDisabled]: readonly [boolean, boolean, unknown]): string => {
      //   return toolsDisabled
      //     ? (alphaDisabled ? '.hue-select > .cursor' : '.alpha-select > .cursor')
      //     : (alphaDisabled ? '.hue-select > .cursor' : '.alpha-select > .cursor');
      // };
      //
      // subscribeOnNodeConnectedTo(
      //   this,
      //   map$$(focusFirst$, getLastElementFocusableSelector),
      //   (selector: string) => {
      //     querySelectorOrThrow<HTMLElement>(this, selector).focus();
      //   },
      // );

    const $onFocusFirst = (): void => {
        const elements = querySelectorAll<HTMLElement>(this, `[tabindex="0"]`);
        for (let i: number = elements.length - 1; i >= 0; i--) {
          if (isElementVisible(elements[i])) {
            elements[i].focus();
            break;
          }
        }
      };

    const $onFocusLast = (): void => {
      querySelectorOrThrow<HTMLElement>(this, '.saturation-and-value-select > .cursor').focus();
    };


    const unsubscribeOfFindFirstCursor = subscribeOnNodeConnectedTo(
      this,
      findDOMElement('.cursor', this),
      (cursorElement: HTMLElement | null): void => {
        if (cursorElement !== null) {
          unsubscribeOfFindFirstCursor();
          cursorElement.focus();
        }
      },
    );


    this.data = {
      saturationAndValueSelectElementBackgroundColor$,
      saturationAndValueSelectCursorElementLeft$,
      saturationAndValueSelectCursorElementTop$,
      hueSelectCursorElementTop$,
      alphaSelectElementBackgroundGradient$,
      alphaSelectCursorElementTop$,
      //
      $onPointerDownSaturationAndValueSelect,
      $onKeyDownSaturationAndValueSelectCursor,
      $onPointerDownHueSelect,
      $onKeyDownHueSelectCursor,
      $onPointerDownAlphaSelect,
      $onKeyDownAlphaSelectCursor,
      $onClickColorPicker,
      $onKeyDownColorPicker,
      $onFocusFirst,
      $onFocusLast,
    };
  }

  onCreate(): IData {
    return this.data;
  }

  override close(origin?: IOverlayCloseOrigin): Promise<void> {
    this.$close();
    return super.close(origin);
  }
}


/** FUNCTIONS **/

function clampSaturation(
  value: number,
): number {
  return mathClamp(value, 0, 1);
}

function clampValue(
  value: number,
): number {
  return mathClamp(value, 0, 1);
}

function clampHue(
  value: number,
): number {
  return mathClamp(value, 0, 359 / 360);
}

function clampAlpha(
  value: number,
): number {
  return mathClamp(value, 0, 1);
}


function getSaturationAndValueFromPointerEvent(event: PointerEvent, element: HTMLElement): [number, number] {
  const elementPositionAndSize: IPositionAndSize = getElementPositionAndSize(element);
  return [
    clampSaturation((event.clientX - elementPositionAndSize.left) / elementPositionAndSize.width),
    clampValue(1 - ((event.clientY - elementPositionAndSize.top) / elementPositionAndSize.height)),
  ];
}

function getHueFromPointerEvent(event: PointerEvent, element: HTMLElement): number {
  const elementPositionAndSize: IPositionAndSize = getElementPositionAndSize(element);
  return clampHue((event.clientY - elementPositionAndSize.top) / elementPositionAndSize.height);
}

function getAlphaFromPointerEvent(event: PointerEvent, element: HTMLElement): number {
  const elementPositionAndSize: IPositionAndSize = getElementPositionAndSize(element);
  return clampAlpha(1 - ((event.clientY - elementPositionAndSize.top) / elementPositionAndSize.height));
}


/** FUNCTIONS **/


function getPositionAndSizeObservableForMatColorInputOverlay(
  getContainerElement: () => MatColorInputOverlayComponent,
  targetElement: HTMLElement,
): IObservable<ICSSPositionAndSize> {
  return getPositionAndSizeObservableForSimpleOverlay({
    getContainerElement,
    targetElement,
    getContentElementSize: () => {
      return {
        width: 250,
        height: 120,
      };
    },
  });
}

