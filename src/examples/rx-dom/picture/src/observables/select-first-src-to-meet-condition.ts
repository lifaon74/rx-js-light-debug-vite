import { combineLatest, IDefaultNotificationsUnion, IObservable, mergeMapSingleObservable } from '@lirx/core';
import { EMPTY_SRC$ } from '../constants/empty-src.constant';

export type ISrcAndCondition = [
  src$: IObservable<IDefaultNotificationsUnion<string>>,
  condition$: IObservable<boolean>,
]

export function selectFirstSrcToMeetCondition(
  data: ISrcAndCondition[],
): IObservable<IDefaultNotificationsUnion<string>> {
  return mergeMapSingleObservable(
    combineLatest<readonly IObservable<boolean>[]>(
      data.map(([, condition$]) => condition$),
    ),
    (
      values: readonly boolean[],
    ): IObservable<IDefaultNotificationsUnion<string>> => {
      for (let i = 0, l = values.length; i < l; i++) {
        if (values[i]) {
          return data[i][0];
        }
      }
      return EMPTY_SRC$;
    },
  );
}
