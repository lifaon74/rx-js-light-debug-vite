import {
  ILocales, interval, IRelativeTimeFormatValueAndUnit, IRelativeTimeFormatOptions, IRelativeTimeFormatUnit,
  IRelativeTimeFormatValue, ISubscribeFunction,
  mapSubscribePipe, of,
  pipeSubscribeFunction, relativeTimeFormatSubscribePipe, ISubscribePipeFunction, IListFormatOptions, single,
} from '@lifaon/rx-js-light';
import { createLocaleFormatContext } from './shared-functions';

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
  createLocaleFormatContext((locales$: ISubscribeFunction<ILocales>) => {
    // const currentDate = new Date();
    // const targetDate = new Date();
    //
    // targetDate.setFullYear(currentDate.getFullYear() - 1);

    // decomposeDuration(currentDate.getTime() - targetDate.getTime());
    //
    //
    // return pipeSubscribeFunction(of<IAdvancedRelativeTimeFormatValue>(5), [
    //   advancedRelativeTimeFormatSubscribePipe(locales$),
    // ]);

    return pipeSubscribeFunction(interval(1000), [
      mapSubscribePipe<void, IRelativeTimeFormatValueAndUnit>(() => ({ value: Date.now(), unit: 'day' })),
      relativeTimeFormatSubscribePipe(locales$, single<IRelativeTimeFormatOptions>({ style: 'long' })),
    ]);
  });
}

