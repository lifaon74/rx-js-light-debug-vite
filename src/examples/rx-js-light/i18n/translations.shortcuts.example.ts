import {
  combineLatest, currencyFormatSubscribePipe, dateTimeShortcutFormatSubscribePipe, ICurrencyFormatOptions, ILocales,
  ILocaleToTranslationKeyToTranslationValueMap, ISubscribeFunction, ITranslationKeyToTranslationValueMap,
  listFormatSubscribePipe, localesToStringArray, numberFormatSubscribePipe,
  pluralRulesResultToTranslationKeySubscribePipe, pluralRulesSubscribePipe, translateSubscribeFunction
} from '@lifaon/rx-js-light';
import { createCurrencySelectElement, createLocaleFormatContext } from './shared-functions';
import { const$$, let$$, map$$, mergeMap$$$, pipe$$ } from '@lifaon/rx-js-light-shortcuts';

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
    return const$$([
      {
        name: 'apple',
        price: const$$(2),
        quantity: const$$(3),
      },
      {
        name: 'banana',
        price: const$$(1.5),
        quantity: const$$(1),
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

    const dateFormatter$$ = dateTimeShortcutFormatSubscribePipe(locales$, const$$('mediumDate'));

    const pluralRules$$ = pluralRulesSubscribePipe(locales$);

    const translated$ = translateSubscribeFunction(
      translations$,
      const$$('translate.product.list'),
      const$$({
        list: pipe$$(products$, [
          mergeMap$$$<IReactiveProduct[], readonly string[]>((products: IReactiveProduct[]): ISubscribeFunction<readonly string[]> => {
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
                  const$$('translate.product.price'),
                  const$$({
                    quantity: quantity$,
                    product: product$,
                    price: price$,
                  }),
                );
              }),
            );
          }, 1),
          listFormatter$$,
        ]),
        date: dateFormatter$$($date$.subscribe),
      }),
    );

    return translated$;
  });

}
