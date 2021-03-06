import {
  createLocalesSource, IEmitFunction, ILocales, ISource, ISubscribeFunction, localesToStringArray, mapSubscribePipe,
  pipeSubscribeFunction
} from '@lifaon/rx-js-light';

declare namespace Intl {
  class DisplayNames {
    constructor(locales: ArrayLike<string>, options: any);

    of(value: string): string;
  }
}

/*------------*/

export const DEFAULT_LANGUAGES = [
  'fr',
  'en',
  'de',
  'it',
  'es',
];

export const DEFAULT_CURRENCIES = [
  'EUR',
  'USD',
  'JPY',
  'GBP',
  'CHF',
];

/*------------*/

export function setLocaleOnWindow(
  emit: IEmitFunction<ILocales>,
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

  pipeSubscribeFunction(localesSource.subscribe, [
    mapSubscribePipe(localesToStringArray)
  ])
  ((locales: string[]) => {
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
  subscribe: ISubscribeFunction<string>
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
  callback: (locales$: ISubscribeFunction<ILocales>) => ISubscribeFunction<string>,
) {
  const $locales$ = createLocalesSource();
  document.body.appendChild(createLocaleSelectElement($locales$));
  document.body.appendChild(createFormatDisplayElement(callback($locales$.subscribe)));
  // console.log($locales$.getObservers().length);

}


