import { IObserver, IObservable, map$$$, pipe$$ } from '@lirx/core';

export type ICreatePristineObservableReturn = [
  subsribe: IObservable<boolean>,
  reset: IObserver<void>,
];

export function createPristineObservable(
  value$: IObservable<string>,
): ICreatePristineObservableReturn {
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
      shareRL$$$<boolean>(),
    ]),
    () => {
      pristine = true;
    },
  ];
}
