import {
  createLocalesSource, createMulticastReplayLastSource, createTranslationsLoader, filterObservablePipe, fromFetch,
  fromPromise, IDefaultNotificationsUnion, IObserver, ILocales, INextNotification, isNextNotification,
  IObservable, IObservableFromFetchNotifications, IObservableFromPromiseNotifications,
  ITranslations, localesToStringArray, mapObservablePipe, mergeMapObservablePipeWithNotifications, pipeObservable,
  pluralRulesTranslationsObservable
} from '@lifaon/rx-js-light';
import { translationsExample } from '../examples/rx-js-light/i18n/translations.example';

/* I18N */

function setLocaleOnWindow(emit: IObserver<ILocales>): void {
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
    return pipeObservable(fromFetch(getTranslationsUrl(locales)), [
      // fulfilledObservablePipe<Response, IObservableFromPromiseNotifications<ITranslationsJSON>>((response: Response): IObservable<IObservableFromPromiseNotifications<ITranslationsJSON>> => {
      //   return fromPromise<ITranslationsJSON>(response.json());
      // }),
      mergeMapObservablePipeWithNotifications<IObservableFromFetchNotifications, ITranslationsJSON>((response: Response): IObservable<IObservableFromPromiseNotifications<ITranslationsJSON>> => {
        return fromPromise<ITranslationsJSON>(response.json());
      }, 1),
      filterObservablePipe<IDefaultNotificationsUnion<ITranslationsJSON>, INextNotification<ITranslationsJSON>>(isNextNotification),
      mapObservablePipe<INextNotification<ITranslationsJSON>, ITranslations>((notification: INextNotification<ITranslationsJSON>): ITranslations => {
        return new Map(notification.value);
      })
    ]);
  });

  // const translated$ = translateObservable(translations$, of('translate.button.title'));
  //
  // translated$((value: string) => {
  //   console.log(value);
  // });


  /*-------------*/

  const $count$ = createMulticastReplayLastSource<number>();

  // const key$ = pipeObservable($count$.subscribe, [
  //   pluralRulesForTranslationsObservablePipe($locales$.subscribe, `translate.count`),
  // ]);
  //
  // const countFormatted$ = pipeObservable($count$.subscribe, [
  //   numberFormatObservablePipe($locales$.subscribe),
  // ]);
  //
  // const translatedCount$ = translateObservable(translations$, key$, of({ count: countFormatted$ }));

  const translatedCount$ = pluralRulesTranslationsObservable($locales$.subscribe, translations$, `translate.count`, $count$.subscribe, `count`);

  translatedCount$((value: string) => {
    console.log(value);
  });

  (window as any).setCount = $count$.emit;
}

export async function debugI18N() {
  // await debugDateTime();
  // await debugCurrency();
  // await debugTranslations();
}

