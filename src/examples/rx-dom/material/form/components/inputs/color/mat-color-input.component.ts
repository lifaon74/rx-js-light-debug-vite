import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, IDynamicStyleValue,
  OnCreate, querySelectorOrThrow, defineObservableProperty,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-color-input.component.html?raw';
// @ts-ignore
import style from './mat-color-input.component.scss?inline';
import { INPUT_VALUE_MODIFIER } from '../../../modifiers/input-value.modifier';
import {
  $$distinct, $$map, $$mapFilter, combineLatest, function$$, IMapFilterDiscard, IObservable, IObserver, ISource, let$$,
  map$$, MAP_FILTER_DISCARD, mapFilter$$, or$$, shareRL$$, single
} from '@lifaon/rx-js-light';
import { MatColorInputOverlayComponent } from './overlay/mat-color-input-overlay.component';
import { createMatOverlayController } from '../../../../overlay/overlay/__component/helpers/create-open-close-tuple';
import { MatOverlayManagerComponent } from '../../../../overlay/overlay/manager/mat-overlay-manager.component';
import { IHSVAColor } from '../../../../../../misc/css/color/colors/hsva/hsva-color.type';
import { colorToHSVAColor } from '../../../../../../misc/css/color/to/color-to-hsva-color';
import { IColor } from '../../../../../../misc/css/color/color.type';
import { hsvaColorToHexString } from '../../../../../../misc/css/color/colors/hsva/to/string/hsva-color-to-hex-string';
import { colorToRGBAColor } from '../../../../../../misc/css/color/to/color-to-rgba-color';
import { rgbaColorToHexString } from '../../../../../../misc/css/color/colors/rgba/to/string/rgba-color-to-hex-string';
import { rgbaColorToRGB$AString } from '../../../../../../misc/css/color/colors/rgba/to/string/rgba-color-to-rgba-string';
import { colorToHSLAColor } from '../../../../../../misc/css/color/to/color-to-hsla-color';
import { hslaColorToHSL$AString } from '../../../../../../misc/css/color/colors/hsla/to/string/hsla-color-to-hsla-string';
import { parseCSSHexColorAsNumber } from '../../../../../../misc/css/color/colors/rgba/parse/parse-css-hex-color';
import { hsvaColorToHSVAString } from '../../../../../../misc/css/color/colors/hsva/to/string/hsla-color-to-hsva-string';
import { MatInputFieldComponent } from '../shared/input-field/mat-input-field.component';
import { colorStringToColor } from './misc/color-string-to-color';
import { $$filter } from '../../../../../../../../../rx-js-light/dist/src/observer/pipes/built-in/filter/filter-observer.shortcut';

// https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/color

/** TYPES **/

const USER_COLOR_FORMAT = '∅';
type IColorFormat = 'hex' | 'rgb' | 'hsl' | typeof USER_COLOR_FORMAT;

/** CONSTANTS **/


/** COMPONENT **/

interface IData {
  readonly previewColor$: IObservable<IDynamicStyleValue>;
  readonly $onClickColorPreview: IObserver<MouseEvent>;
  readonly $onKeyDownColorPreview: IObserver<KeyboardEvent>;
  readonly disabled$: IObservable<boolean>;
  readonly readonly$: IObservable<boolean>;
  readonly disabledTabindex$: IObservable<string | null>;
  readonly $inputValue$: ISource<string>;
  readonly selectedColorFormat$: IObservable<IColorFormat>;
  readonly $onClickColorFormatButton: IObserver<MouseEvent>;
  readonly $onKeyDownColorFormatButton: IObserver<KeyboardEvent>;
}

/*-----*/

@Component({
  name: 'mat-color-input',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html,
    modifiers: [
      INPUT_VALUE_MODIFIER,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
  // useShadowDOM: true,
})
export class MatColorInputComponent extends MatInputFieldComponent<string> implements OnCreate<IData> {

  alphaDisabled$!: IObservable<boolean>;
  readonly $alphaDisabled!: IObserver<boolean>;
  alphaDisabled!: boolean;

  readonly colorValue$: IObservable<IHSVAColor>;

  protected readonly _data: IData;

  constructor() {
    super('');

    /** VARIABLES **/

    const $value = this.$value;
    const value$ = this.value$;

    const disabled$ = this.disabled$;
    const readonly$ = this.readonly$;

    const $alphaDisabled$ = let$$<IObservable<boolean>>(single(true));
    defineObservableProperty(this, 'alphaDisabled', $alphaDisabled$);
    const alphaDisabled$ = this.alphaDisabled$;

    const disabledTabindex$ = map$$(or$$(disabled$, readonly$), (disabled: boolean) => disabled ? null : '0');

    const $selectedColorFormat$ = let$$<IColorFormat>('hex');
    const $selectedColorFormat = $selectedColorFormat$.emit, selectedColorFormat$ = $selectedColorFormat$.subscribe;

    // COLOR
    const color$ = map$$(value$, colorStringToColor);

    const hsvaColor$ = shareRL$$(map$$(color$, colorToHSVAColor));
    const $hsvaColor = $$map($$distinct($value), (color: IHSVAColor): string => {
      if ($selectedColorFormat$.getValue() === USER_COLOR_FORMAT) {
        $selectedColorFormat('hex');
      }
      return hsvaColorToHSVAString(color, 4);
    });
    // hsvaColor$(_ => console.log(_, hsvaColorToString(_)));

    this.colorValue$ = function$$(
      [hsvaColor$, alphaDisabled$],
      (hsvaColor: IHSVAColor, alphaDisabled: boolean): IHSVAColor => {
        return alphaDisabled
          ? {
            ...hsvaColor,
            a: 1
          }
          : hsvaColor;
      },
    );

    // OVERLAY

    const $close = () => {
      querySelectorOrThrow<HTMLElement>(this, ':scope > .color-preview').focus();
    };

    const { toggle } = createMatOverlayController<[]>((): MatColorInputOverlayComponent => {
      return MatOverlayManagerComponent.getInstance()
        .open_legacy(MatColorInputOverlayComponent, [{
          targetElement: this,
          $close,
          hsvaColor$,
          $hsvaColor,
          alphaDisabled$,
        }]);
    });

    const toggleMatColorInputOverlay = () => {
      if (!this.disabled && !this.readonly) {
        toggle([]);
      }
    };

    /** COLOR PREVIEW **/

    const previewColor$ = map$$(hsvaColor$, hsvaColorToHexString);
    // setTimeout(toggleMatColorInputOverlay, 50);

    const $onClickColorPreview = toggleMatColorInputOverlay;
    const $onKeyDownColorPreview = $$filter(toggleMatColorInputOverlay, (event: KeyboardEvent) => (event.key === 'Enter'));

    /** INPUT **/

    const inputValue$ = mapFilter$$(
      combineLatest<[typeof value$, typeof selectedColorFormat$]>([value$, selectedColorFormat$]),
      ([value, selectedColorFormat]: readonly [string, IColorFormat]): string | IMapFilterDiscard => {
        const color: IColor = colorStringToColor(value);
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

    const $inputValue = (value: string): void => {
      $selectedColorFormat(USER_COLOR_FORMAT);
      $value(value);
    };

    const $inputValue$ = {
      subscribe: inputValue$,
      emit: $inputValue,
    };

    /**  COLOR FORMAT BUTTON**/

    const $onClickColorFormatButton = $$map($selectedColorFormat, (): IColorFormat => {
      return getNextColorFormat($selectedColorFormat$.getValue(), this.value);
    });

    const $onKeyDownColorFormatButton = $$mapFilter($selectedColorFormat, (event: KeyboardEvent): IColorFormat | IMapFilterDiscard => {
      if ((event.key === 'ArrowDown') || (event.key === 'ArrowRight') || (event.key === 'Enter')) {
        return getNextColorFormat($selectedColorFormat$.getValue(), this.value);
      } else if ((event.key === 'ArrowUp') || (event.key === 'ArrowLeft')) {
        return getPreviousColorFormat($selectedColorFormat$.getValue(), this.value);
      } else {
        return MAP_FILTER_DISCARD;
      }
    });


    // INIT
    // $hsvaColor(DEFAULT_MAT_COLOR_INPUT_COLOR);

    // this.readonly = true;
    // this.disabled = true;

    this._data = {
      previewColor$,
      $onClickColorPreview,
      $onKeyDownColorPreview,
      disabled$,
      readonly$,
      disabledTabindex$,
      $inputValue$,
      selectedColorFormat$,
      $onClickColorFormatButton,
      $onKeyDownColorFormatButton,
    };
  }

  onCreate(): IData {
    return this._data;
  }
}


/** FUNCTIONS **/

function getPreviousColorFormat(
  selectedColorFormat: IColorFormat,
  value: string,
): IColorFormat {
  switch (selectedColorFormat) {
    case USER_COLOR_FORMAT:
      return (parseCSSHexColorAsNumber(value) === null)
        ? 'hex'
        : 'hsl';
    case 'hex':
      return 'hsl';
    case 'rgb':
      return 'hex';
    case 'hsl':
      return 'rgb';
  }
}

function getNextColorFormat(
  selectedColorFormat: IColorFormat,
  value: string,
): IColorFormat {
  switch (selectedColorFormat) {
    case USER_COLOR_FORMAT:
      return (parseCSSHexColorAsNumber(value) === null)
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
