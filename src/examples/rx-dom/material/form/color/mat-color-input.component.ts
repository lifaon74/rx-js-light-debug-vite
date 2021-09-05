import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, enableComponentTemplateAOT, generateGetNodeModifierFunctionFromArray,
  getComponentTemplateForAOT,
  HTMLElementConstructor, OnCreate,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-color-input.component.html?raw';
// @ts-ignore
import style from './mat-color-input.component.scss';
import { havingMultipleSubscribeFunctionProperties } from '../../../../misc/having-multiple-subscribe-function-properties';
import { createHigherOrderVariable } from '../../../../misc/create-higher-order-variable';
import { INPUT_VALUE_MODIFIER } from '../modifiers/input-value.modifier';
import {
  combineLatest, IEmitFunction, IMapFilterDiscard, ISource, ISubscribeFunction, MAP_FILTER_DISCARD, single
} from '@lifaon/rx-js-light';
import { $$map, let$$, letU$$, map$$, mapFilter$$, shareR$$ } from '@lifaon/rx-js-light-shortcuts';
import { MatColorInputOverlayComponent } from './overlay/mat-color-input-overlay.component';
import { createOpenCloseTuple } from '../../overlay/overlay/component/helpers/create-open-close-tuple';
import { MatOverlayManagerComponent } from '../../overlay/overlay/manager/mat-overlay-manager.component';
import { IHSVAColor, IReadonlyHSVAColor } from '../../../../misc/css/color/colors/hsva/hsva-color.type';
import { DEFAULT_MAT_COLOR_INPUT_COLOR } from './misc/default-mat-color-input-color.constant';
import { parseCSSColor } from '../../../../misc/css/color/parse-css-color';
import { colorToHSVAColor } from '../../../../misc/css/color/to/color-to-hsva-color';
import { IColor } from '../../../../misc/css/color/color.type';
import { hsvaColorToHexString } from '../../../../misc/css/color/colors/hsva/to/string/hsva-color-to-hex-string';
import { colorToRGBAColor } from '../../../../misc/css/color/to/color-to-rgba-color';
import { rgbaColorToHexString } from '../../../../misc/css/color/colors/rgba/to/string/rgba-color-to-hex-string';
import { rgbaColorToRGB$AString } from '../../../../misc/css/color/colors/rgba/to/string/rgba-color-to-rgba-string';
import { colorToHSLAColor } from '../../../../misc/css/color/to/color-to-hsla-color';
import { hslaColorToHSL$AString } from '../../../../misc/css/color/colors/hsla/to/string/hsla-color-to-hsla-string';
import { parseCSSHexColorAsNumber } from '../../../../misc/css/color/colors/rgba/parse/parse-css-hex-color';
import { hsvaColorToHSVAString } from '../../../../misc/css/color/colors/hsva/to/string/hsla-color-to-hsva-string';

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color

/** TYPES **/

export type IColorInputValue = IReadonlyHSVAColor | null;
const USER_COLOR_FORMAT = '∅';
type IColorFormat = 'hex' | 'rgb' | 'hsl' | typeof USER_COLOR_FORMAT;

/** CONSTANTS **/


/** COMPONENT **/


type IMatColorInputComponentInputs<GValue> = [
  ['readonly', boolean],
];

interface IData {
  readonly previewColor$: ISubscribeFunction<string>;
  readonly $inputValue$: ISource<string>;
  readonly selectedColorFormat$: ISubscribeFunction<IColorFormat>;
  readonly $clickColorFormatButton: IEmitFunction<MouseEvent>;
}

const MAT_COLOR_INPUT_MODIFIERS = [
  INPUT_VALUE_MODIFIER,
];

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
  getNodeModifier: generateGetNodeModifierFunctionFromArray(MAT_COLOR_INPUT_MODIFIERS)
};

/*-----*/

// function debutAOT(): void {
//   enableComponentTemplateAOT();
//   const template = compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT);
//   console.log(getComponentTemplateForAOT(template));
// }
// debutAOT();

/*-----*/

@Component({
  name: 'mat-color-input',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  style: compileReactiveCSSAsComponentStyle(style),
})
export class MatColorInputComponent<GValue> extends havingMultipleSubscribeFunctionProperties<IMatColorInputComponentInputs<any>, HTMLElementConstructor>(HTMLElement) implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    // const [$rawValue$, rawValue$] = createHigherOrderVariable<string>(DEFAULT_COLOR_STRING);

    const $rawValue$ = letU$$<string>();
    const $rawValue = $rawValue$.emit, rawValue$ = $rawValue$.subscribe;

    const [$readonly$, readonly$] = createHigherOrderVariable<boolean>(false);

    super([
      ['readonly', $readonly$],
    ]);

    const $selectedColorFormat$ = let$$<IColorFormat>('hex');
    const $selectedColorFormat = $selectedColorFormat$.emit, selectedColorFormat$ = $selectedColorFormat$.subscribe;

    // COLOR
    const color$ = map$$(rawValue$, colorStringToColor);

    const hsvaColor$ = shareR$$(map$$(color$, colorToHSVAColor));
    const $hsvaColor = $$map($rawValue, (color: IHSVAColor): string => {
      if ($selectedColorFormat$.getValue() === USER_COLOR_FORMAT) {
        $selectedColorFormat('hex');
      }
      return hsvaColorToHSVAString(color, 4);
    });
    // hsvaColor$(_ => console.log(_, hsvaColorToString(_)));


    const previewColor$ = map$$(hsvaColor$, hsvaColorToHexString);

    /** INPUT **/

    const inputValue$ = mapFilter$$(
      combineLatest<[typeof rawValue$, typeof selectedColorFormat$]>([rawValue$, selectedColorFormat$]),
      ([rawValue, selectedColorFormat]: readonly [string, IColorFormat]): string | IMapFilterDiscard => {
        const color: IColor = colorStringToColor(rawValue);
        switch (selectedColorFormat) {
          case USER_COLOR_FORMAT:
            return MAP_FILTER_DISCARD;
          case 'hex':
            return rgbaColorToHexString(colorToRGBAColor(color));
          case 'rgb':
            return rgbaColorToRGB$AString(colorToRGBAColor(color));
          case 'hsl':
            return hslaColorToHSL$AString(colorToHSLAColor(color));
        }
      },
    );

    const $inputValue = (rawValue: string): void => {
      $selectedColorFormat(USER_COLOR_FORMAT);
      $rawValue(rawValue);
    };

    const $inputValue$ = {
      subscribe: inputValue$,
      emit: $inputValue,
    };

    /**  COLOR FORMAT BUTTON**/

    const $clickColorFormatButton = $$map($selectedColorFormat, (): IColorFormat => {
      return getNextColorFormat($selectedColorFormat$.getValue(), $rawValue$.getValue());
    });


    // OPTIONS

    const alphaDisabled$ = single(false);

    /** BINDS **/

    const [open, close] = createOpenCloseTuple<[HTMLElement]>((targetElement: HTMLElement): MatColorInputOverlayComponent => {
      return MatOverlayManagerComponent.getInstance()
        .open(MatColorInputOverlayComponent, [{
          targetElement,
          hsvaColor$,
          $hsvaColor,
          alphaDisabled$,
        }]);
    });

    open(this);

    // INIT
    $hsvaColor(DEFAULT_MAT_COLOR_INPUT_COLOR);

    this._data = {
      previewColor$,
      $inputValue$,
      selectedColorFormat$,
      $clickColorFormatButton,
    };
  }

  onCreate(): IData {
    return this._data;
  }
}


/** FUNCTIONS **/

function colorStringToColor(colorString: string): IColor {
  const color: IColor | null = parseCSSColor(colorString);
  return (color === null)
    ? DEFAULT_MAT_COLOR_INPUT_COLOR
    : color;
}


function getNextColorFormat(
  selectedColorFormat: IColorFormat,
  rawValue: string,
): IColorFormat {
  switch (selectedColorFormat) {
    case USER_COLOR_FORMAT:
      return (parseCSSHexColorAsNumber(rawValue) === null)
        ? 'hex'
        : 'rgb';
    case 'hex':
      return 'rgb';
    case 'rgb':
      return 'hsl';
    case 'hsl':
      return 'hex';
  }
}
