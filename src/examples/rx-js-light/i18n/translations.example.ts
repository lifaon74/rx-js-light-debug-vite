import {
  combineLatest, fromPromise, function$$, IObservable, let$$, map$$, mergeMapS$$$, notificationsToLastValueObservable,
  pipe$$, shareR$$, single,
} from '@lirx/core';
import { createCurrencySelectElement, createLocaleFormatContext } from './shared-functions';
import {
  currencyFormat$$$, dateTimeFormatS$$$, ICurrencyFormatOptions, ILocales, ILocaleToTranslations, ITranslations,
  listFormat$$$, localesToStringArray, numberFormat$$$, pluralRules$$$, pluralRulesResultToTranslationKey$$$,
  translate$$,
} from '@lirx/i18n';

function buildSimplePluralTranslations(
  key: string,
  singularValue: string,
  pluralValue: string,
): [string, string][] {
  return [
    ...['one'].map((quantity: string): [string, string] => [`${key}[${quantity}]`, singularValue]),
    ...['zero', 'two', 'few', 'many', 'other'].map((quantity: string): [string, string] => [`${key}[${quantity}]`, pluralValue]),
  ];
}

const TRANSLATIONS: ILocaleToTranslations = new Map<string, ITranslations>([
  ['en', new Map([
    ...buildSimplePluralTranslations('translate.apple', 'apple', 'apples'),
    ...buildSimplePluralTranslations('translate.banana', 'banana', 'bananas'),
    // ['translate.banana[one]', 'banana'],
    // ['translate.banana[other]', 'bananas'],
    ['translate.product.price', '{{ quantity }} {{ product }} at {{ price }}'],
    ['translate.product.list', 'I will sell {{ list }} the {{ date }}'],
  ])],
  ['fr', new Map([
    ...buildSimplePluralTranslations('translate.apple', 'pomme', 'pommes'),
    ...buildSimplePluralTranslations('translate.banana', 'banane', 'bananes'),
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

  function getTranslationsMap(locales: ILocales): ITranslations {
    const _locales: string[] = localesToStringArray(locales);
    for (let i = 0, l = _locales.length; i < l; i++) {
      const locale: string = _locales[i];
      if (TRANSLATIONS.has(locale)) {
        return TRANSLATIONS.get(locale) as ITranslations;
      }
    }
    return TRANSLATIONS.get('en') as ITranslations;
  }


  const localesToTranslationsMap = (
    locales$: IObservable<ILocales>,
  ): IObservable<ITranslations> => {
    // @ts-ignore
    const module$ = import('https://cdn.skypack.dev/@formatjs/intl-localematcher');

    return function$$(
      [
        locales$,
        notificationsToLastValueObservable(fromPromise<any>(module$)),
      ],
      (
        locales: ILocales,
        { match },
      ): ITranslations => {
        const bestFittingLocale: string = match(
          localesToStringArray(locales),
          Array.from(TRANSLATIONS.keys()),
          'en',
        );
        return TRANSLATIONS.get(bestFittingLocale) as ITranslations;
      },
    );
  };

  interface IReactiveProduct {
    name: string;
    price: IObservable<number>;
    quantity: IObservable<number>;
  }

  function generateProductSource(): IObservable<IReactiveProduct[]> {
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

  function generateProductSourceFromProxy(): IObservable<IReactiveProduct[]> {
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

    const $products$ = let$$(products);

    (window as any).$products$ = $products$;

    // $products$.emit(
    //   $products$.getValue().concat([{
    //     name: 'coco',
    //     price: 3.2,
    //     quantity: 6,
    //   }])
    // );

    const productCache = new WeakMap<IProduct, IReactiveProduct>();

    return map$$($products$.subscribe, ((products: IProduct[]): IReactiveProduct[] => {
        return products.map((product: IProduct): IReactiveProduct => {
          if (!productCache.has(product)) {
            productCache.set(product, {
              name: product.name,
              price: single(product.price),
              quantity: single(product.quantity),
            });
          }
          return productCache.get(product) as IReactiveProduct;
        });
      }),
    );
  }

  const products$ = generateProductSource();
  // const products$ = generateProductSourceFromProxy();


  createLocaleFormatContext((locales$: IObservable<ILocales>) => {
    // const translations$ = map$$(locales$, getTranslationsMap);
    const translations$ = shareR$$(localesToTranslationsMap(locales$));

    const $currency$ = let$$<string>('EUR');
    document.body.appendChild(createCurrencySelectElement($currency$));
    const currency$ = $currency$.subscribe;

    const $date$ = let$$<number>(Date.now());

    const numberFormatter$$ = numberFormat$$$(locales$);

    const currencyFormatter$$ = currencyFormat$$$(
      locales$,
      map$$(currency$, (currency: string): ICurrencyFormatOptions => ({ currency })),
    );

    const listFormatter$$ = listFormat$$$(locales$);
    // const listFormatter$$ = listFormatObservablePipe(locales$);

    const dateFormatter$$ = dateTimeFormatS$$$(locales$, single('mediumDate'));

    const pluralRules$$ = pluralRules$$$(locales$);

    const translated$ = translate$$(
      translations$,
      single('translate.product.list'),
      single({
        list: pipe$$(products$, [
          mergeMapS$$$<IReactiveProduct[], readonly string[]>((products: IReactiveProduct[]): IObservable<readonly string[]> => {
            return combineLatest(
              products.map((product: IReactiveProduct): IObservable<string> => {

                const quantity$ = numberFormatter$$(product.quantity);

                const product$ = translate$$(
                  translations$,
                  pipe$$(product.quantity, [
                    pluralRules$$,
                    pluralRulesResultToTranslationKey$$$(`translate.${product.name}`),
                  ]),
                );

                const price$ = currencyFormatter$$(product.price);

                return translate$$(
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
    // return debounceMicrotask$$(translated$);
  });

}

