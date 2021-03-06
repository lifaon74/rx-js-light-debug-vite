import {
  dateTimeShortcutFormatSubscribePipe, IDateTimeShortcutFormat, ILocales, interval, ISubscribeFunction,
  mapSubscribePipe, of, pipeSubscribeFunction
} from '@lifaon/rx-js-light';
import { createLocaleFormatContext } from './shared-functions';


export function formatDateExample() {
  createLocaleFormatContext((locales$: ISubscribeFunction<ILocales>) => {
    return pipeSubscribeFunction(interval(1000), [
      mapSubscribePipe<void, number>(() => Date.now()),
      dateTimeShortcutFormatSubscribePipe(locales$, of<IDateTimeShortcutFormat>('medium')),
    ]);
  });
}

