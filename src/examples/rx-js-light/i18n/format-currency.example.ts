import {
  createMulticastReplayLastSource, currencyFormatSubscribePipe, ILocales, interval, ISubscribeFunction,
  mapSubscribePipe, pipeSubscribeFunction
} from '@lifaon/rx-js-light';
import { createCurrencySelectElement, createLocaleFormatContext } from './shared-functions';


export function formatCurrencyExample() {
  createLocaleFormatContext((locales$: ISubscribeFunction<ILocales>) => {
    const $currency$ = createMulticastReplayLastSource<string>({ initialValue: 'EUR' });
    document.body.appendChild(createCurrencySelectElement($currency$));

    const options$ = pipeSubscribeFunction($currency$.subscribe, [
      mapSubscribePipe((currency: string) => ({ currency })),
    ]);

    return pipeSubscribeFunction(interval(1000), [
      mapSubscribePipe<void, number>(() => Math.random() * 1e6),
      currencyFormatSubscribePipe(locales$, options$),
    ]);
  });
}

