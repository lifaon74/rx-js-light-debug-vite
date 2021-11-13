import { functionD$$, IObservable, IObservablePipe } from '@lifaon/rx-js-light';
import { IOptionalSource } from '../picture.example';

export function mediaSourceCondition(
  condition: IObservable<boolean>,
): IObservablePipe<IOptionalSource, IOptionalSource> {
  return (subscribe: IObservable<IOptionalSource>): IObservable<IOptionalSource> => {
    return functionD$$(
      [
        subscribe,
        condition,
      ],
      (src: IOptionalSource, valid: boolean): IOptionalSource => {
        return valid
          ? src
          : void 0;
      },
    );
  };
}

