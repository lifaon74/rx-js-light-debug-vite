import {
  DATE_TIME_FORMAT_MEDIUM_DATE, dateTimeFormatSubscribePipe, ILocales, interval, ISubscribeFunction, mapSubscribePipe,
  of, pipeSubscribeFunction
} from '@lifaon/rx-js-light';
import { createLocaleFormatContext } from './shared-functions';


export function formatDateExample() {
  createLocaleFormatContext((locales$: ISubscribeFunction<ILocales>) => {
    return pipeSubscribeFunction(interval(1000), [
      mapSubscribePipe<void, number>(() => Date.now()),
      dateTimeFormatSubscribePipe(locales$, of(DATE_TIME_FORMAT_MEDIUM_DATE)),
      // dateTimeShortcutFormatSubscribePipe(locales$, of<IDateTimeShortcutFormat>('medium')),
    ]);
  });
}

