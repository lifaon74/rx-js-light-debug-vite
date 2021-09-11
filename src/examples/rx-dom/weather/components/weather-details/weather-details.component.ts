import {
  compileAndEvaluateReactiveHTMLAsComponentTemplate, compileReactiveCSSAsComponentStyle, Component,
  DEFAULT_CONSTANTS_TO_IMPORT, OnCreate
} from '@lifaon/rx-dom';
// @ts-ignore
import html from './weather-details.component.html?raw';
// @ts-ignore
import style from './weather-details.component.scss';
import {
  ILocaleToTranslationKeyToTranslationValueMap, ITranslationKeyToTranslationValueMap, LOCALES
} from '@lifaon/rx-js-light';
import { Immutable } from '@lifaon/rx-store';

/** CONSTANTS **/

const locales$ = LOCALES.subscribe;

const TRANSLATIONS: ILocaleToTranslationKeyToTranslationValueMap = new Map<string, ITranslationKeyToTranslationValueMap>([
  ['en', new Map([
    ['translate.uvi', 'UV Indice'],
    ['translate.humidity', 'Humidity'],
    ['translate.clouds', 'Clouds'],
    ['translate.wind', 'Wind'],
  ])],
]);


/** COMPONENT **/


type IData = Immutable<{}>;

const CONSTANTS_TO_IMPORT = {
  ...DEFAULT_CONSTANTS_TO_IMPORT,
};

@Component({
  name: 'app-weather-details',
  template: compileAndEvaluateReactiveHTMLAsComponentTemplate(html, CONSTANTS_TO_IMPORT),
  styles: [compileReactiveCSSAsComponentStyle(style)],
})
export class AppWeatherDetailsComponent extends HTMLElement implements OnCreate<IData> {

  protected readonly _data: IData;

  constructor() {
    super();

    this._data = {};
  }

  public onCreate(): IData {
    return this._data;
  }
}

