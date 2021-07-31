import { ISubscribeFunction, ISubscribePipeFunction } from '@lifaon/rx-js-light';
import { functionD$$ } from '@lifaon/rx-js-light-shortcuts';
import { IOptionalSource } from '../picture.example';

export function mediaSourceCondition(
  condition: ISubscribeFunction<boolean>,
): ISubscribePipeFunction<IOptionalSource, IOptionalSource> {
  return (subscribe: ISubscribeFunction<IOptionalSource>): ISubscribeFunction<IOptionalSource> => {
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

