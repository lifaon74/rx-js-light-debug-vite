import {
  createMulticastReplayLastSource, interval, IObservable, map$$$,
  mapObservablePipe, pipe$$, pipeObservable
} from '@lifaon/rx-js-light';
import { createCurrencySelectElement, createLocaleFormatContext } from './shared-functions';
import { currencyFormatObservablePipe, ILocales } from '@lifaon/rx-i18n';


export function formatCurrencyExample() {
  createLocaleFormatContext((locales$: IObservable<ILocales>) => {
    const $currency$ = createMulticastReplayLastSource<string>({ initialValue: 'EUR' });
    document.body.appendChild(createCurrencySelectElement($currency$));

    const options$ = pipeObservable($currency$.subscribe, [
      mapObservablePipe((currency: string) => ({ currency })),
    ]);

    return pipe$$(interval(1000), [
      map$$$<void, number>(() => Math.random() * 1e6),
      currencyFormatObservablePipe(locales$, options$),
    ]);
  });
}

