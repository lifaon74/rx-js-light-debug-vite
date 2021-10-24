import {
  compileReactiveCSSAsComponentStyle, compileReactiveHTMLAsGenericComponentTemplate, Component, IDynamicStyleValue,
  OnCreate, querySelectorOrThrow, setComponentSubscribeFunctionProperties,
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './mat-switch-input.component.html?raw';
// @ts-ignore
import style from './mat-switch-input.component.scss?inline';
import { INPUT_VALUE_MODIFIER } from '../../../modifiers/input-value.modifier';
import {
  combineLatest, IEmitFunction, IMapFilterDiscard, ISource, ISubscribeFunction, MAP_FILTER_DISCARD, single
} from '@lifaon/rx-js-light';
import {
  $$distinct, $$filter, $$map, $$mapFilter, function$$, let$$, map$$, mapFilter$$, or$$, shareR$$
} from '@lifaon/rx-js-light-shortcuts';
import { createMatOverlayController } from '../../../../overlay/overlay/component/helpers/create-open-close-tuple';
import { MatOverlayManagerComponent } from '../../../../overlay/overlay/manager/mat-overlay-manager.component';
import { IHSVAColor } from '../../../../../../misc/css/color/colors/hsva/hsva-color.type';
import { parseCSSColor } from '../../../../../../misc/css/color/parse-css-color';
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
import { MatInputComponent } from '../shared/input/mat-input.component';

/** TYPES **/

export type IMatSwitchInputComponentState = 'off' | 'on' | 'indeterminate';

/** COMPONENT **/

interface IData {
  // readonly previewColor$: ISubscribeFunction<IDynamicStyleValue>;
}

/*-----*/

@Component({
  name: 'mat-switch-input',
  template: compileReactiveHTMLAsGenericComponentTemplate({
    html,
    modifiers: [
      INPUT_VALUE_MODIFIER,
    ],
  }),
  styles: [compileReactiveCSSAsComponentStyle(style)],
  // useShadowDOM: true,
})
export class MatSwitchInputComponent extends MatInputComponent<IMatSwitchInputComponentState> implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super('indeterminate');

    /** VARIABLES **/

    const $value = this.$value;
    const value$ = this.value$;

    const disabled$ = this.disabled$;
    const readonly$ = this.readonly$;

    this._data = {
      disabled$,
      readonly$,
    };
  }

  onCreate(): IData {
    return this._data;
  }
}

