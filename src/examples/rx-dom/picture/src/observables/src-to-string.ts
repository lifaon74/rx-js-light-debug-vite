import {
  IDefaultNotificationsUnion, IMapFilterDiscard, IObservable, MAP_FILTER_DISCARD, mapFilter$$,
} from '@lirx/core';
import { BROKEN_SRC } from '../constants/broken-src.constant';

export function srcToString(
  src$: IObservable<IDefaultNotificationsUnion<string>>,
): IObservable<string> {
  return mapFilter$$(src$, ({ name, value }: IDefaultNotificationsUnion<string>): string | IMapFilterDiscard  => {
    switch (name) {
      case 'next':
        return value;
      case 'error':
        console.log(BROKEN_SRC);
        return BROKEN_SRC;
      case 'complete':
      default:
        return MAP_FILTER_DISCARD;
    }
  });
}
