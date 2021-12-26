import { IObservable, IObserver, ISource, map$$ } from '@lifaon/rx-js-light';
import { createLocalesSource, ILocales, localesToStringArray } from '@lifaon/rx-i18n';

declare namespace Intl {
  class DisplayNames {
    constructor(locales: ArrayLike<string>, options: any);

    of(value: string): string;
  }
}

/*------------*/

// export const DEFAULT_LANGUAGES = [
//   'fr',
//   'fr-FR',
//   'en',
//   'de',
//   'it',
//   'es',
// ];

export const DEFAULT_LANGUAGES = [
  'af-ZA',
  'am-ET',
  'ar-AE',
  'ar-BH',
  'ar-DZ',
  'ar-EG',
  'ar-IQ',
  'ar-JO',
  'ar-KW',
  'ar-LB',
  'ar-LY',
  'ar-MA',
  'arn-CL',
  'ar-OM',
  'ar-QA',
  'ar-SA',
  'ar-SD',
  'ar-SY',
  'ar-TN',
  'ar-YE',
  'as-IN',
  'az-az',
  'az-Cyrl-AZ',
  'az-Latn-AZ',
  'ba-RU',
  'be-BY',
  'bg-BG',
  'bn-BD',
  'bn-IN',
  'bo-CN',
  'br-FR',
  'bs-Cyrl-BA',
  'bs-Latn-BA',
  'ca-ES',
  'co-FR',
  'cs-CZ',
  'cy-GB',
  'da-DK',
  'de-AT',
  'de-CH',
  'de-DE',
  'de-LI',
  'de-LU',
  'dsb-DE',
  'dv-MV',
  'el-CY',
  'el-GR',
  'en-029',
  'en-AU',
  'en-BZ',
  'en-CA',
  'en-cb',
  'en-GB',
  'en-IE',
  'en-IN',
  'en-JM',
  'en-MT',
  'en-MY',
  'en-NZ',
  'en-PH',
  'en-SG',
  'en-TT',
  'en-US',
  'en-ZA',
  'en-ZW',
  'es-AR',
  'es-BO',
  'es-CL',
  'es-CO',
  'es-CR',
  'es-DO',
  'es-EC',
  'es-ES',
  'es-GT',
  'es-HN',
  'es-MX',
  'es-NI',
  'es-PA',
  'es-PE',
  'es-PR',
  'es-PY',
  'es-SV',
  'es-US',
  'es-UY',
  'es-VE',
  'et-EE',
  'eu-ES',
  'fa-IR',
  'fi-FI',
  'fil-PH',
  'fo-FO',
  'fr-BE',
  'fr-CA',
  'fr-CH',
  'fr-FR',
  'fr-LU',
  'fr-MC',
  'fy-NL',
  'ga-IE',
  'gd-GB',
  'gd-ie',
  'gl-ES',
  'gsw-FR',
  'gu-IN',
  'ha-Latn-NG',
  'he-IL',
  'hi-IN',
  'hr-BA',
  'hr-HR',
  'hsb-DE',
  'hu-HU',
  'hy-AM',
  'id-ID',
  'ig-NG',
  'ii-CN',
  'in-ID',
  'is-IS',
  'it-CH',
  'it-IT',
  'iu-Cans-CA',
  'iu-Latn-CA',
  'iw-IL',
  'ja-JP',
  'ka-GE',
  'kk-KZ',
  'kl-GL',
  'km-KH',
  'kn-IN',
  'kok-IN',
  'ko-KR',
  'ky-KG',
  'lb-LU',
  'lo-LA',
  'lt-LT',
  'lv-LV',
  'mi-NZ',
  'mk-MK',
  'ml-IN',
  'mn-MN',
  'mn-Mong-CN',
  'moh-CA',
  'mr-IN',
  'ms-BN',
  'ms-MY',
  'mt-MT',
  'nb-NO',
  'ne-NP',
  'nl-BE',
  'nl-NL',
  'nn-NO',
  'no-no',
  'nso-ZA',
  'oc-FR',
  'or-IN',
  'pa-IN',
  'pl-PL',
  'prs-AF',
  'ps-AF',
  'pt-BR',
  'pt-PT',
  'qut-GT',
  'quz-BO',
  'quz-EC',
  'quz-PE',
  'rm-CH',
  'ro-mo',
  'ro-RO',
  'ru-mo',
  'ru-RU',
  'rw-RW',
  'sah-RU',
  'sa-IN',
  'se-FI',
  'se-NO',
  'se-SE',
  'si-LK',
  'sk-SK',
  'sl-SI',
  'sma-NO',
  'sma-SE',
  'smj-NO',
  'smj-SE',
  'smn-FI',
  'sms-FI',
  'sq-AL',
  'sr-BA',
  'sr-CS',
  'sr-Cyrl-BA',
  'sr-Cyrl-CS',
  'sr-Cyrl-ME',
  'sr-Cyrl-RS',
  'sr-Latn-BA',
  'sr-Latn-CS',
  'sr-Latn-ME',
  'sr-Latn-RS',
  'sr-ME',
  'sr-RS',
  'sr-sp',
  'sv-FI',
  'sv-SE',
  'sw-KE',
  'syr-SY',
  'ta-IN',
  'te-IN',
  'tg-Cyrl-TJ',
  'th-TH',
  'tk-TM',
  'tn-ZA',
  'tr-TR',
  'tt-RU',
  'tzm-Latn-DZ',
  'ug-CN',
  'uk-UA',
  'ur-PK',
  'uz-Cyrl-UZ',
  'uz-Latn-UZ',
  'uz-uz',
  'vi-VN',
  'wo-SN',
  'xh-ZA',
  'yo-NG',
  'zh-CN',
  'zh-HK',
  'zh-MO',
  'zh-SG',
  'zh-TW',
  'zu-ZA',
];

// export const DEFAULT_CURRENCIES = [
//   'EUR',
//   'USD',
//   'JPY',
//   'GBP',
//   'CHF',
// ];

export const DEFAULT_CURRENCIES = (Intl as any).supportedValuesOf("currency");

/*------------*/

export function setLocaleOnWindow(
  emit: IObserver<ILocales>,
): void {
  (window as any).setLocale = emit;
}


export function createLocaleSelectElement(
  localesSource: ISource<ILocales>,
  languages: string[] = DEFAULT_LANGUAGES,
): HTMLSelectElement {
  const selectElement = document.createElement('select');

  const displayNames = new Intl.DisplayNames(navigator.languages, { type: 'language' });

  for (let i = 0, l = languages.length; i < l; i++) {
    const locale: string = languages[i];
    const optionElement = document.createElement('option');
    optionElement.value = locale;
    optionElement.innerText = displayNames.of(locale);
    selectElement.appendChild(optionElement);
  }

  selectElement.addEventListener('change', () => {
    // debugger;
    localesSource.emit(selectElement.value);
  });

  const locatesAsStringArray$ = map$$(localesSource.subscribe, localesToStringArray);

  locatesAsStringArray$((locales: string[]) => {
    selectElement.value = locales[0];
  });


  return selectElement;
}

export function createCurrencySelectElement(
  currencySource: ISource<string>,
  currencies: string[] = DEFAULT_CURRENCIES,
): HTMLSelectElement {
  const selectElement = document.createElement('select');

  for (let i = 0, l = currencies.length; i < l; i++) {
    const currency: string = currencies[i];
    const optionElement = document.createElement('option');
    optionElement.value = currency;
    optionElement.innerText = currency;
    selectElement.appendChild(optionElement);
  }

  selectElement.addEventListener('change', () => {
    currencySource.emit(selectElement.value);
  });

  currencySource.subscribe((currency: string) => {
    selectElement.value = currency;
  });


  return selectElement;
}

export function createFormatDisplayElement(
  subscribe: IObservable<string>
): HTMLElement {
  const element = document.createElement('div');
  const textNode = new Text();
  subscribe((value: string) => {
    console.log(value);
    textNode.data = value;
  });
  element.appendChild(textNode);
  return element;
}

export function createLocaleFormatContext(
  callback: (locales$: IObservable<ILocales>) => IObservable<string>,
) {
  const $locales$ = createLocalesSource();
  document.body.appendChild(createLocaleSelectElement($locales$));
  document.body.appendChild(createFormatDisplayElement(callback($locales$.subscribe)));
  // console.log($locales$.getObservers().length);

}


