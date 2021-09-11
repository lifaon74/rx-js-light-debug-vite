import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, OnCreate, OnInit, querySelector, querySelectorOrThrow, setReactiveClass,
  subscribeOnNodeConnectedTo,
} from '@lifaon/rx-dom';
import { fromAnimationFrame, fromEventTarget, IEmitFunction, ISubscribeFunction } from '@lifaon/rx-js-light';
// @ts-ignore
import style from './mat-color-input-overlay.component.scss';
// @ts-ignore
import html from './mat-color-input-overlay.component.html?raw';
import { ICSSPositionAndSize } from '../../../../../../misc/types/position-and-size/css-position-and-size.type';
import { MatSimpleOverlayComponent } from '../../../../overlay/overlay/built-in/simple/mat-simple-overlay.component';
import { MatOverlayManagerComponent } from '../../../../overlay/overlay/manager/mat-overlay-manager.component';
import { debounceFrame$$, map$$ } from '@lifaon/rx-js-light-shortcuts';
import { IPositionAndSize } from '../../../../../../misc/types/position-and-size/position-and-size.type';
import { getElementPositionAndSize } from '../../../../../../misc/types/position-and-size/get-element-position-and-size';
import { ISize } from '../../../../../../misc/types/size/size.type';
import { positionAndSizeToCSSPositionAndSize } from '../../../../../../misc/types/position-and-size/position-and-size-to-css-position-and-size';
import { POSITION_AND_SIZE_OUT_OF_WINDOW } from '../../../../overlay/overlay/built-in/simple/helper/position-and-size-out-of-window.constant';
import { getFittingBoxForContainer$Target$ContentElements } from '../../../../overlay/overlay/built-in/simple/helper/get-fitting-box-for-container-target-content-elements';
import { IReadonlyHSVAColor } from '../../../../../../misc/css/color/colors/hsva/hsva-color.type';
import { DEFAULT_MAT_COLOR_INPUT_COLOR } from '../misc/default-mat-color-input-color.constant';
import { createHSVAColor } from '../../../../../../misc/css/color/colors/hsva/create-hsva-color';
import { createHSLAColor } from '../../../../../../misc/css/color/colors/hsla/create-hsla-color';
import { hslaColorToHexString } from '../../../../../../misc/css/color/colors/hsla/to/string/hsla-color-to-hex-string';
import { IHSLAColor } from '../../../../../../misc/css/color/colors/hsla/hsla-color.type';
import { hsvaColorToHexString } from '../../../../../../misc/css/color/colors/hsva/to/string/hsva-color-to-hex-string';
import { mathClamp } from '../../../../../../misc/math/clamp';
import { makeMatOverlayComponentBackdropClosable } from '../../../../overlay/overlay/component/helpers/make-mat-overlay-component-backdrop-closable';
import { makeMatOverlayComponentClosableWithEscape } from '../../../../overlay/overlay/component/helpers/make-mat-overlay-component-closable-with-escape';
import { IOverlayCloseOrigin } from '../../../../overlay/overlay/component/mat-overlay.component';


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
  readonly $close: IEmitFunction<void>;
  readonly $hsvaColor: IEmitFunction<IReadonlyHSVAColor>;
  readonly hsvaColor$: ISubscribeFunction<IReadonlyHSVAColor>;
  readonly alphaDisabled$: ISubscribeFunction<boolean>;
}


interface IData {
  readonly saturationAndValueSelectElementBackgroundColor$: ISubscribeFunction<string>;
  readonly saturationAndValueSelectCursorElementLeft$: ISubscribeFunction<string>;
  readonly saturationAndValueSelectCursorElementTop$: ISubscribeFunction<string>;
  readonly hueSelectCursorElementTop$: ISubscribeFunction<string>;
  readonly alphaSelectElementBackgroundGradient$: ISubscribeFunction<string>;
  readonly alphaSelectCursorElementTop$: ISubscribeFunction<string>;
  readonly $pointerDownSaturationAndValueSelect: IEmitFunction<PointerEvent>;
  readonly $keyDownSaturationAndValueSelectCursor: IEmitFunction<KeyboardEvent>;
  readonly $pointerDownHueSelect: IEmitFunction<PointerEvent>;
  readonly $keyDownHueSelectCursor: IEmitFunction<KeyboardEvent>;
  readonly $pointerDownAlphaSelect: IEmitFunction<PointerEvent>;
  readonly $keyDownAlphaSelectCursor: IEmitFunction<KeyboardEvent>;
  readonly $focusFirst: IEmitFunction<FocusEvent>;
  readonly $focusLast: IEmitFunction<FocusEvent>;
}

// const MAT_COLOR_INPUT_OVERLAY_MODIFIERS = [
//   NODE_REFERENCE_MODIFIER,
// ];

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  // getNodeModifier: generateGetNodeModifierFunctionFromArray(MAT_COLOR_INPUT_OVERLAY_MODIFIERS)
};

@Component({
  name: 'mat-color-input-overlay',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class MatColorInputOverlayComponent extends MatSimpleOverlayComponent implements OnCreate<IData>, OnInit {
  protected readonly data: IData;
  protected readonly $close: IEmitFunction<void>;

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
    const positionAndSize$: ISubscribeFunction<ICSSPositionAndSize> = getPositionAndSizeSubscribeFunctionForColorInputOverlay(
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
      (hsvaColor: IReadonlyHSVAColor): string => hsvaColorToHexString(createHSVAColor(hsvaColor.h, 1, 1, 1)),
    );

    const saturationAndValueSelectCursorElementLeft$ = map$$(
      hsvaColor$,
      (hsvaColor: IReadonlyHSVAColor): string => `${ (hsvaColor.s * 100) }%`,
    );

    const saturationAndValueSelectCursorElementTop$ = map$$(
      hsvaColor$,
      (hsvaColor: IReadonlyHSVAColor): string => `${ ((1 - hsvaColor.v) * 100) }%`,
    );


    const hueSelectCursorElementTop$ = map$$(
      hsvaColor$,
      (hsvaColor: IReadonlyHSVAColor) => `${ (hsvaColor.h * 100) }%`,
    );

    const alphaSelectElementBackgroundGradient$ = map$$(
      hsvaColor$,
      (hsvaColor: IReadonlyHSVAColor): string => {
        const color: string = hsvaColorToHexString({
          ...hsvaColor,
          a: 1,
        });
        return `linear-gradient(to bottom, ${ color } 0%, transparent 100%)`;
      },
    );

    const alphaSelectCursorElementTop$ = map$$(
      hsvaColor$,
      (hsvaColor: IReadonlyHSVAColor): string => `${ ((1 - hsvaColor.a) * 100) }%`,
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

    const $pointerDownSaturationAndValueSelect = (event: PointerEvent): void => {
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

    const $keyDownSaturationAndValueSelectCursor = (event: KeyboardEvent): void => {
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
      }
    };


    // HUE

    const $pointerDownHueSelect = (event: PointerEvent): void => {
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

    const $keyDownHueSelectCursor = (event: KeyboardEvent): void => {
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
      }
    };

    // ALPHA

    const $pointerDownAlphaSelect = (event: PointerEvent): void => {
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

    const $keyDownAlphaSelectCursor = (event: KeyboardEvent): void => {
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
      }
    };

    setReactiveClass(alphaDisabled$, this, 'alpha-disabled');


    /** FOCUS **/

    const $focusFirst = (): void => {
      querySelectorOrThrow<HTMLElement>(this, '.alpha-select > .cursor').focus();
    };

    const $focusLast = (): void => {
      querySelectorOrThrow<HTMLElement>(this, '.saturation-and-value-select > .cursor').focus();
    };

    this.data = {
      saturationAndValueSelectElementBackgroundColor$,
      saturationAndValueSelectCursorElementLeft$,
      saturationAndValueSelectCursorElementTop$,
      hueSelectCursorElementTop$,
      alphaSelectElementBackgroundGradient$,
      alphaSelectCursorElementTop$,
      //
      $pointerDownSaturationAndValueSelect,
      $keyDownSaturationAndValueSelectCursor,
      $pointerDownHueSelect,
      $keyDownHueSelectCursor,
      $pointerDownAlphaSelect,
      $keyDownAlphaSelectCursor,
      $focusFirst,
      $focusLast,
    };
  }

  onCreate(): IData {
    return this.data;
  }

  override close(origin?: IOverlayCloseOrigin): Promise<void> {
    this.$close();
    return super.close();
  }

  override onInit(): void {
    super.onInit();
    querySelectorOrThrow<HTMLElement>(this, '.cursor').focus();
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

const elementMargin: number = 5;
const containerHorizontalMargin: number = 5;
const containerVerticalMargin: number = 5;

export function getPositionAndSizeSubscribeFunctionForColorInputOverlay(
  getContainerElement: () => MatColorInputOverlayComponent,
  targetElement: HTMLElement,
): ISubscribeFunction<ICSSPositionAndSize> {
  return map$$<void, ICSSPositionAndSize>(fromAnimationFrame(), () => {
    const containerElement: HTMLElement = getContainerElement();
    const contentElement: HTMLElement | null = querySelector(containerElement, `:scope > .content`);

    if (contentElement === null) {
      return POSITION_AND_SIZE_OUT_OF_WINDOW;
    } else {
      const containerElementPositionAndSize: IPositionAndSize = getElementPositionAndSize(containerElement);
      const targetElementPositionAndSize: IPositionAndSize = getElementPositionAndSize(targetElement);

      const contentElementSize: ISize = {
        width: 200,
        height: 120,
      };

      return positionAndSizeToCSSPositionAndSize(
        getFittingBoxForContainer$Target$ContentElements({
          containerElementPositionAndSize,
          targetElementPositionAndSize,
          contentElementSize,
          // extra
          elementMargin,
          containerHorizontalMargin,
          containerVerticalMargin,
        }),
      );
    }
  });
}

