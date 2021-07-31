import { IEmitFunction, ISubscribeFunction } from '@lifaon/rx-js-light';
import { map$$$, pipe$$, shareR$$$ } from '@lifaon/rx-js-light-shortcuts';

export type ICreatePristineSubscribeFunctionReturn = [
  subsribe: ISubscribeFunction<boolean>,
  reset: IEmitFunction<void>,
];

export function createPristineSubscribeFunction(
  value$: ISubscribeFunction<string>,
): ICreatePristineSubscribeFunctionReturn {
  let pristine: boolean = true;
  // INFO: is pristine until focused instead ?
  return [
    pipe$$(value$, [
      map$$$<string, boolean>((value: string): boolean => {
        if (pristine && (value !== '')) {
          pristine = false;
        }
        return pristine;
      }),
      shareR$$$<boolean>(),
    ]),
    () => {
      pristine = true;
    },
  ];
}
