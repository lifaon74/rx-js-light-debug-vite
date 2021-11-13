import { andM$$, IObservable, map$$ } from '@lifaon/rx-js-light';
import { IOptionalSource } from '../picture.example';

export function mediaSourcePipe(
  src: string,
  conditions: IObservable<boolean>[],
): IObservable<IOptionalSource> {
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
