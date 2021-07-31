import { combineLatest, ISubscribeFunction } from '@lifaon/rx-js-light';
import { andM$$, functionD$$, map$$, pipe$$ } from '@lifaon/rx-js-light-shortcuts';
import { IOptionalSource } from '../picture.example';
import { mediaSourceCondition } from './media-source-condition';
import { mediaSource } from './media-source';

export function mediaSourcePipe(
  src: string,
  conditions: ISubscribeFunction<boolean>[],
): ISubscribeFunction<IOptionalSource> {
  return map$$(andM$$(...conditions), (valid: boolean): IOptionalSource => {
    return valid
      ? src
      : void 0;
  });
  // return pipe$$(
  //   mediaSource(src),
  //   conditions.map(mediaSourceCondition),
  // );
}
