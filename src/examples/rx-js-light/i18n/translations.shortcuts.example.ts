import {
  combineLatest, currencyFormatSubscribePipe, dateTimeShortcutFormatSubscribePipe, ICurrencyFormatOptions, ILocales,
  ILocaleToTranslationKeyToTranslationValueMap, ISubscribeFunction, ITranslationKeyToTranslationValueMap,
  listFormatSubscribePipe, localesToStringArray, numberFormatSubscribePipe,
  pluralRulesResultToTranslationKeySubscribePipe, pluralRulesSubscribePipe, translateSubscribeFunction, single
} from '@lifaon/rx-js-light';
import { createCurrencySelectElement, createLocaleFormatContext } from './shared-functions';
import { let$$, map$$, mergeMap$$$, mergeMapS$$$, pipe$$ } from '@lifaon/rx-js-light-shortcuts';

// declare namespace Intl {
//   const Locale: any;
// }


const TRANSLATIONS: ILocaleToTranslationKeyToTranslationValueMap = new Map<string, ITranslationKeyToTranslationValueMap>([
  ['en', new Map([
    ['translate.apple[one]', 'apple'],
    ['translate.apple[other]', 'apples'],
    ['translate.banana[one]', 'banana'],
    ['translate.banana[other]', 'bananas'],
    ['translate.product.price', '{{ quantity }} {{ product }} at {{ price }}'],
    ['translate.product.list', 'I will sell {{ list }} the {{ date }}'],
  ])],
  ['fr', new Map([
    ['translate.apple[one]', 'pomme'],
    ['translate.apple[other]', 'pommes'],
    ['translate.banana[one]', 'banane'],
    ['translate.banana[other]', 'bananes'],
    ['translate.product.price', '{{ quantity }} {{ product }} à {{ price }}'],
    ['translate.product.list', 'Je vais vendre {{ list }} le {{ date }}'],
  ])],
]);

/**
 * I18N for: 'I will sell 3 apples for 2$ and 1 banana for 1.5$ the 01/01/2040'
 *
 * Includes: date, list, plural rules, currency, numbers, and translations
 */
export function translationsShortcutsExample() {

  function getTranslationsMap(locales: ILocales): ITranslationKeyToTranslationValueMap {
    const _locales: string[] = localesToStringArray(locales);
    for (let i = 0, l = _locales.length; i < l; i++) {
      const locale: string = _locales[i];
      if (TRANSLATIONS.has(locale)) {
        return TRANSLATIONS.get(locale) as ITranslationKeyToTranslationValueMap;
      }
    }
    return TRANSLATIONS.get('en') as ITranslationKeyToTranslationValueMap;
  }


  interface IReactiveProduct {
    name: string;
    price: ISubscribeFunction<number>;
    quantity: ISubscribeFunction<number>;
  }

  function generateProductSource(): ISubscribeFunction<IReactiveProduct[]> {
    return single([
      {
        name: 'apple',
        price: single(2),
        quantity: single(3),
      },
      {
        name: 'banana',
        price: single(1.5),
        quantity: single(1),
      },
    ]);
  }

  const products$ = generateProductSource();

  createLocaleFormatContext((locales$: ISubscribeFunction<ILocales>) => {
    const translations$ = map$$(locales$, getTranslationsMap);

    const $currency$ = let$$<string>('EUR');
    document.body.appendChild(createCurrencySelectElement($currency$));

    const $date$ = let$$(Date.now());

    const numberFormatter$$ = numberFormatSubscribePipe(locales$);

    const currencyFormatter$$ = currencyFormatSubscribePipe(
      locales$,
      map$$($currency$.subscribe, (currency: string): ICurrencyFormatOptions => ({ currency })),
    );

    const listFormatter$$ = listFormatSubscribePipe(locales$);

    const dateFormatter$$ = dateTimeShortcutFormatSubscribePipe(locales$, single('mediumDate'));

    const pluralRules$$ = pluralRulesSubscribePipe(locales$);

    const translated$ = translateSubscribeFunction(
      translations$,
      single('translate.product.list'),
      single({
        list: pipe$$(products$, [
          mergeMapS$$$<IReactiveProduct[], readonly string[]>((products: IReactiveProduct[]): ISubscribeFunction<readonly string[]> => {
            return combineLatest(
              products.map((product: IReactiveProduct): ISubscribeFunction<string> => {

                const quantity$ = numberFormatter$$(product.quantity);

                const product$ = translateSubscribeFunction(
                  translations$,
                  pipe$$(product.quantity, [
                    pluralRules$$,
                    pluralRulesResultToTranslationKeySubscribePipe(`translate.${ product.name }`),
                  ]),
                );

                const price$ = currencyFormatter$$(product.price);

                return translateSubscribeFunction(
                  translations$,
                  single('translate.product.price'),
                  single({
                    quantity: quantity$,
                    product: product$,
                    price: price$,
                  }),
                );
              }),
            );
          }),
          listFormatter$$,
        ]),
        date: dateFormatter$$($date$.subscribe),
      }),
    );

    return translated$;
  });

}
