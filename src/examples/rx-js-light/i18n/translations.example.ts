import {
  combineLatest, createMulticastReplayLastSource, currencyFormatSubscribePipe, dateTimeShortcutFormatSubscribePipe,
  extractReactiveStringParts, ICurrencyFormatOptions, ILocales, ILocaleToTranslationKeyToTranslationValueMap,
  ISubscribeFunction, ITranslationKeyToTranslationValueMap, listFormatSubscribePipe, localesToStringArray,
  mapSubscribePipe, mergeMapSubscribePipe, numberFormatSubscribePipe, of, pipeSubscribeFunction,
  pluralRulesResultToTranslationKeySubscribePipe, pluralRulesSubscribePipe, reactiveFunction, translateSubscribeFunction
} from '@lifaon/rx-js-light';
import { createCurrencySelectElement, createLocaleFormatContext } from './shared-functions';

// declare namespace Intl {
//   const Locale: any;
// }


/*
syntax:



 */

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
export function translationsExample() {

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
    return createMulticastReplayLastSource({
      initialValue: [
        {
          name: 'apple',
          price: of(2),
          quantity: of(3),
        },
        {
          name: 'banana',
          price: of(1.5),
          quantity: of(1),
        },
      ]
    }).subscribe;
  }

  function generateProductSourceFromProxy(): ISubscribeFunction<IReactiveProduct[]> {
    interface IProduct {
      name: string;
      price: number;
      quantity: number;
    }

    const products: IProduct[] = [
      {
        name: 'apple',
        price: 2,
        quantity: 3,
      },
      {
        name: 'banana',
        price: 1.5,
        quantity: 1,
      },
    ];

    const $products$ = createMulticastReplayLastSource({
      initialValue: products,
    });

    (window as any).$products$ = $products$;

    // $products$.emit(
    //   $products$.getValue().concat([{
    //     name: 'coco',
    //     price: 3.2,
    //     quantity: 6,
    //   }])
    // );

    const productCache = new WeakMap<IProduct, IReactiveProduct>();

    return pipeSubscribeFunction($products$.subscribe, [
      mapSubscribePipe((products: IProduct[]): IReactiveProduct[] => {
        return products.map((product: IProduct): IReactiveProduct => {
          if (!productCache.has(product)) {
            productCache.set(product, {
              name: product.name,
              price: of(product.price),
              quantity: of(product.quantity),
            });
          }
          return productCache.get(product) as IReactiveProduct;
        });
      }),
    ]);
  }

  const products$ = generateProductSource();
  // const products$ = generateProductSourceFromProxy();


  createLocaleFormatContext((locales$: ISubscribeFunction<ILocales>) => {
    const translations$ = pipeSubscribeFunction(locales$, [
      mapSubscribePipe(getTranslationsMap),
    ]);

    const $currency$ = createMulticastReplayLastSource<string>({ initialValue: 'EUR' });
    document.body.appendChild(createCurrencySelectElement($currency$));

    const $date$ = createMulticastReplayLastSource<number>({ initialValue: Date.now() });

    const numberFormatter$$ = numberFormatSubscribePipe(locales$);

    const currencyFormatter$$ = currencyFormatSubscribePipe(locales$, pipeSubscribeFunction($currency$.subscribe, [
      mapSubscribePipe((currency: string): ICurrencyFormatOptions => ({ currency })),
    ]));

    const listFormatter$$ = listFormatSubscribePipe(locales$);

    const dateFormatter$$ = dateTimeShortcutFormatSubscribePipe(locales$, of('mediumDate'));

    const pluralRules$$ = pluralRulesSubscribePipe(locales$);

    const translated$ = translateSubscribeFunction(
      translations$,
      of('translate.product.list'),
      of({
        list: pipeSubscribeFunction(products$, [
          mergeMapSubscribePipe<IReactiveProduct[], readonly string[]>((products: IReactiveProduct[]): ISubscribeFunction<readonly string[]> => {
            return combineLatest(
              products.map((product: IReactiveProduct): ISubscribeFunction<string> => {

                const quantity$ = pipeSubscribeFunction(product.quantity, [
                  numberFormatter$$,
                ]);

                const product$ = translateSubscribeFunction(
                  translations$,
                  pipeSubscribeFunction(product.quantity, [
                    pluralRules$$,
                    pluralRulesResultToTranslationKeySubscribePipe(`translate.${ product.name }`),
                  ]),
                );

                const price$ = pipeSubscribeFunction(product.price, [
                  currencyFormatter$$,
                ]);

                return translateSubscribeFunction(
                  translations$,
                  of('translate.product.price'),
                  of({
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
        date: pipeSubscribeFunction($date$.subscribe, [
          dateFormatter$$,
        ]),
      }),
    );

    return translated$;
  });

}



// export function translationsExample() {
//
//   function getTranslationValueFromTranslationKeyToTranslationValueMap(
//     translationKeyToTranslationValueMap: ITranslationKeyToTranslationValueMap,
//     key: string,
//   ): string {
//     return translationKeyToTranslationValueMap.has(key)
//       ? translationKeyToTranslationValueMap.get(key) as string
//       : key;
//   }
//
//   // function getTranslationKeyToTranslationValueMapFromLocaleToTranslationKeyToTranslationValueMap(
//   //   localeToTranslationKeyToTranslationValueMap: ILocaleToTranslationKeyToTranslationValueMap,
//   //   locales: ILocales,
//   // ): ITranslationKeyToTranslationValueMap {
//   //   const _locales: string[] = localesToStringArray(locales);
//   //   // TODO locale matcher
//   //   for (let i = 0, l = _locales.length; i < l; i++) {
//   //     const locale: string = _locales[i];
//   //     if (localeToTranslationKeyToTranslationValueMap.has(locale)) {
//   //       return localeToTranslationKeyToTranslationValueMap.get(locale) as ITranslationKeyToTranslationValueMap;
//   //     }
//   //   }
//   //   // TODO improve => return null ? accept a default locale as param ? throw ? etc...
//   //   return localeToTranslationKeyToTranslationValueMap.get('en') as ITranslationKeyToTranslationValueMap;
//   // }
//
//   // function getTranslationValueFromLocaleToTranslationKeyToTranslationValueMap(
//   //   localeToTranslationKeyToTranslationValueMap: ILocaleToTranslationKeyToTranslationValueMap,
//   //   locales: ILocales,
//   //   key: string,
//   // ): string | null {
//   //   return getTranslationValueFromTranslationKeyToTranslationValueMap(
//   //     getTranslationKeyToTranslationValueMapFromLocaleToTranslationKeyToTranslationValueMap(
//   //       localeToTranslationKeyToTranslationValueMap,
//   //       locales,
//   //     ),
//   //     key,
//   //   );
//   // }
//
//   function localeMatcher(
//     requestedLocales: string[],
//     availableLocales: string[],
//     defaultLocale: string,
//   ): string {
//     const _availableLocales: Set<string> = new Set<string>(availableLocales.map((availableLocales: string) => (new (Intl as any).Locale(availableLocales)).language));
//     for (let i = 0, l = requestedLocales.length; i < l; i++) {
//       const requestedLocale: string = (new (Intl as any).Locale(requestedLocales[i]).language);
//       if (_availableLocales.has(requestedLocale)) {
//         return requestedLocale;
//       }
//     }
//     return (new (Intl as any).Locale(defaultLocale)).language;
//   }
//
//
//   function translate(
//     locales: ILocales,
//     localeToTranslationKeyToTranslationValueMap: ILocaleToTranslationKeyToTranslationValueMap,
//     key: string,
//     parameters: { [key: string]: string } = {},
//   ): string {
//     // TODO use Intl.LocaleMatcher.match when available
//     const locale: string = localeMatcher(
//       localesToStringArray(locales),
//       Array.from(localeToTranslationKeyToTranslationValueMap.keys()),
//       'en',
//     );
//
//     if (localeToTranslationKeyToTranslationValueMap.has(locale)) {
//       const translationKeyToTranslationValueMap: ITranslationKeyToTranslationValueMap = localeToTranslationKeyToTranslationValueMap.get(locale) as ITranslationKeyToTranslationValueMap;
//       if (translationKeyToTranslationValueMap.has(key)) {
//         const { texts, variables } = extractReactiveStringParts(translationKeyToTranslationValueMap.get(key) as string);
//         let output: string = '';
//         const length: number = variables.length;
//         for (let i = 0; i < length; i++) {
//           output += texts[i];
//           const variable: string = variables[i];
//           if (variable in parameters) {
//             output += parameters[variable];
//           } else {
//             output += `{{ ${ variable } }}`;
//           }
//         }
//         output += texts[length];
//         return output;
//       } else {
//         return key;
//       }
//     } else {
//       return key;
//     }
//   }
//
//   interface IProduct {
//     name: string;
//     price: number;
//     quantity: number;
//   }
//
//   interface IData {
//     products: IProduct[];
//   }
//
//   const data: IData = {
//     products: [
//       {
//         name: 'apple',
//         price: 2,
//         quantity: 3,
//       },
//       {
//         name: 'banana',
//         price: 1.5,
//         quantity: 1,
//       },
//     ]
//   };
//
//   const $dataSource$ = createMulticastReplayLastSource({ initialValue: data });
//
//   // const proxy = createSubscribeFunctionProxy(dataSource.subscribe);
//
//   createLocaleFormatContext((locales$: ISubscribeFunction<ILocales>) => {
//
//     const $currency$ = createMulticastReplayLastSource<string>({ initialValue: 'EUR' });
//     document.body.appendChild(createCurrencySelectElement($currency$));
//
//     const $translation$ = createMulticastReplayLastSource({ initialValue: TRANSLATIONS });
//
//     const translated$ = reactiveFunction((
//       translations: ILocaleToTranslationKeyToTranslationValueMap,
//       locales: ILocales,
//       currency: string,
//       data: IData,
//     ): string => {
//       return translate(locales, translations, 'translate.product.list', {
//         list: new (Intl as any).ListFormat(locales, { style: 'long', type: 'conjunction' }).format(
//           data.products.map((product: IProduct) => {
//             return translate(locales, translations, 'translate.product.price', {
//               product: translate(locales, translations, `translate.${ product.name }[${ new Intl.PluralRules(locales as string[]).select(product.quantity) }]`),
//               quantity: new Intl.NumberFormat(locales as string[]).format(product.quantity),
//               price: new Intl.NumberFormat(locales as string[], {
//                 style: 'currency',
//                 currency: currency
//               }).format(product.quantity),
//             });
//           }),
//         ),
//       });
//     }, [
//       $translation$.subscribe,
//       locales$,
//       $currency$.subscribe,
//       $dataSource$.subscribe,
//     ]);
//
//
//     return translated$;
//   });
//
// }
