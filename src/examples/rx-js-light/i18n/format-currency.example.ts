import { interval, IObservable, let$$, map$$, map$$$, pipe$$ } from '@lirx/core';
import { createCurrencySelectElement, createLocaleFormatContext } from './shared-functions';
import { currencyFormat$$$, ILocales } from '@lirx/i18n';


export function formatCurrencyExample() {
  createLocaleFormatContext((locales$: IObservable<ILocales>) => {
    const $currency$ = let$$<string>('EUR');
    document.body.appendChild(createCurrencySelectElement($currency$));

    const options$ = map$$($currency$.subscribe, (currency: string) => ({ currency }));

    return pipe$$(interval(1000), [
      map$$$<void, number>(() => Math.random() * 1e6),
      currencyFormat$$$(locales$, options$),
    ]);
  });
}

