import { interval, IObservable, map$$$, pipe$$, single } from '@lirx/core';
import { createLocaleFormatContext } from './shared-functions';
import {
  ILocales, IRelativeTimeFormatOptions, IRelativeTimeFormatUnit, IRelativeTimeFormatValue,
  relativeTimeFormaObservablePipe,
} from '@lirx/i18n';

// const MS_TO_SEC = 1e-3;
// const MS_TO_MIN = MS_TO_SEC / 60;
// const MS_TO_HOUR = MS_TO_MIN / 60;
// const MS_TO_DAY = MS_TO_HOUR / 24;
// const MS_TO_YEAR = MS_TO_DAY / 365;


// export function datesToRelativeTimeFormatValueAndUnit(
//   targetDate: Date,
//   currentDate: Date = new Date(),
// ): IRelativeTimeFormatValueAndUnit {
//   let value!: IRelativeTimeFormatValue;
//   let unit!: IRelativeTimeFormatUnit;
//
//   console.log(currentDate);
//   console.log(targetDate);
//   const years: number = targetDate.getFullYear() - currentDate.getFullYear();
//   // const year = value
//   return {
//     value,
//     unit,
//   };
// }

export function formatRelativeTimeExample() {
  createLocaleFormatContext((locales$: IObservable<ILocales>) => {
    // const currentDate = new Date();
    // const targetDate = new Date();
    //
    // targetDate.setFullYear(currentDate.getFullYear() - 1);

    // decomposeDuration(currentDate.getTime() - targetDate.getTime());
    //
    //
    // return pipeObservable(of<IAdvancedRelativeTimeFormatValue>(5), [
    //   advancedRelativeTimeFormatObservablePipe(locales$),
    // ]);

    return pipe$$(interval(1000), [
      map$$$<void, IRelativeTimeFormatValue>((): IRelativeTimeFormatValue => Date.now()),
      relativeTimeFormaObservablePipe(single<IRelativeTimeFormatUnit>('day'), locales$, single<IRelativeTimeFormatOptions>({ style: 'long' })),
    ]);
  });
}

