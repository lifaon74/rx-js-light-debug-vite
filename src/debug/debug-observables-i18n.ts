import {
  createLocalesSource, createMulticastReplayLastSource, createTranslationsLoader, filterSubscribePipe, fromFetch,
  fromPromise, IDefaultNotificationsUnion, IEmitFunction, ILocales, INextNotification, isNextNotification,
  ISubscribeFunction, ISubscribeFunctionFromFetchNotifications, ISubscribeFunctionFromPromiseNotifications,
  ITranslations, localesToStringArray, mapSubscribePipe, mergeMapSubscribePipeWithNotifications, pipeSubscribeFunction,
  pluralRulesTranslationsSubscribeFunction
} from '@lifaon/rx-js-light';
import { translationsExample } from '../examples/rx-js-light/i18n/translations.example';

/* I18N */

function setLocaleOnWindow(emit: IEmitFunction<ILocales>): void {
  (window as any).setLocale = emit;
}


async function debugTranslations() {
  const $locales$ = createLocalesSource();
  setLocaleOnWindow($locales$.emit);

  const TRANSLATIONS = new Map<string, ITranslations>([
    ['en', new Map([
      ['translate.button.title', 'Next'],
      ['translate.count[one]', '{{ count }} item'],
      ['translate.count[other]', '{{ count }} items'],
    ])],
    ['fr', new Map([
      ['translate.button.title', 'Suivant'],
    ])],
  ]);

  const TRANSLATIONS_URLS = new Map(Array.from(TRANSLATIONS.entries(), ([locale, translations]) => {
    const file = new File([JSON.stringify(Array.from(translations.entries()))], `${ locale }.json`, { type: 'application/json' });
    return [locale, window.URL.createObjectURL(file)];
  }));

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

  function getTranslationsUrl(locales: ILocales): string {
    const _locales: string[] = localesToStringArray(locales);
    for (let i = 0, l = _locales.length; i < l; i++) {
      const locale: string = _locales[i];
      if (TRANSLATIONS_URLS.has(locale)) {
        return TRANSLATIONS_URLS.get(locale) as string;
      }
    }
    return TRANSLATIONS_URLS.get('en') as string;
  }


  type ITranslationsJSON = [string, string][];

  const translations$ = createTranslationsLoader($locales$.subscribe, (locales: ILocales) => {
    // return of(getTranslationsMap(locales));
    return pipeSubscribeFunction(fromFetch(getTranslationsUrl(locales)), [
      // fulfilledSubscribePipe<Response, ISubscribeFunctionFromPromiseNotifications<ITranslationsJSON>>((response: Response): ISubscribeFunction<ISubscribeFunctionFromPromiseNotifications<ITranslationsJSON>> => {
      //   return fromPromise<ITranslationsJSON>(response.json());
      // }),
      mergeMapSubscribePipeWithNotifications<ISubscribeFunctionFromFetchNotifications, ITranslationsJSON>((response: Response): ISubscribeFunction<ISubscribeFunctionFromPromiseNotifications<ITranslationsJSON>> => {
        return fromPromise<ITranslationsJSON>(response.json());
      }, 1),
      filterSubscribePipe<IDefaultNotificationsUnion<ITranslationsJSON>, INextNotification<ITranslationsJSON>>(isNextNotification),
      mapSubscribePipe<INextNotification<ITranslationsJSON>, ITranslations>((notification: INextNotification<ITranslationsJSON>): ITranslations => {
        return new Map(notification.value);
      })
    ]);
  });

  // const translated$ = translateSubscribeFunction(translations$, of('translate.button.title'));
  //
  // translated$((value: string) => {
  //   console.log(value);
  // });


  /*-------------*/

  const $count$ = createMulticastReplayLastSource<number>();

  // const key$ = pipeSubscribeFunction($count$.subscribe, [
  //   pluralRulesForTranslationsSubscribePipe($locales$.subscribe, `translate.count`),
  // ]);
  //
  // const countFormatted$ = pipeSubscribeFunction($count$.subscribe, [
  //   numberFormatSubscribePipe($locales$.subscribe),
  // ]);
  //
  // const translatedCount$ = translateSubscribeFunction(translations$, key$, of({ count: countFormatted$ }));

  const translatedCount$ = pluralRulesTranslationsSubscribeFunction($locales$.subscribe, translations$, `translate.count`, $count$.subscribe, `count`);

  translatedCount$((value: string) => {
    console.log(value);
  });

  (window as any).setCount = $count$.emit;
}

export async function debugI18N() {
  // await debugDateTime();
  // await debugCurrency();
  // await debugTranslations();
  // await formatDateExample();
  // await formatCurrencyExample();
  // await translationsExample();
  await translationsExample();
}

