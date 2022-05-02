import { IObservable } from '@lirx/core';
import { ISrcAndCondition, selectFirstSrcToMeetCondition } from './select-first-src-to-meet-condition';
import { srcToString } from './src-to-string';

export function picture$$(
  data: ISrcAndCondition[],
): IObservable<string> {
  return srcToString(selectFirstSrcToMeetCondition(data));
}
