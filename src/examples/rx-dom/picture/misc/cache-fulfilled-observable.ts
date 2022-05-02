import {
  createMulticastReplaySource, futureUnsubscribe, IDefaultNotificationsUnion, IMulticastReplaySource, IObservable,
  IObservablePipe, IObserver, IUnsubscribe, unsubscribeOnce,
} from '@lirx/core';

export function cacheFulfilledObservable<GValue>(
  subscribe: IObservable<IDefaultNotificationsUnion<GValue>>,
  maxNumberOfValues?: number,
): IObservable<IDefaultNotificationsUnion<GValue>> {
  type IState = 'none' | 'pending' | 'complete';
  let unsubscribe: IUnsubscribe;
  let observersCount: number = 0;
  let state: IState = 'none';
  const source: IMulticastReplaySource<IDefaultNotificationsUnion<GValue>> = createMulticastReplaySource<IDefaultNotificationsUnion<GValue>>(maxNumberOfValues);

  return (emit: IObserver<IDefaultNotificationsUnion<GValue>>): IUnsubscribe => {
    observersCount++;
    const unsubscribeSource: IUnsubscribe = source.subscribe(emit);

    if (state === 'none') {
      state = 'pending';

      unsubscribe = futureUnsubscribe((
        unsubscribe: IUnsubscribe,
      ): IUnsubscribe => {
        return subscribe((value: IDefaultNotificationsUnion<GValue>): void => {
          source.emit(value);
          switch (value.name) {
            case 'complete':
              unsubscribe();
              state = 'complete';
              break;
            case 'error':
              unsubscribe();
              source.reset();
              state = 'none';
              break;
          }
        });
      });
    }

    return unsubscribeOnce((): void => {
      unsubscribeSource();
      observersCount--;
      if (
        (observersCount === 0)
        && (state === 'pending')
      ) {
        unsubscribe();
      }
    });
  };
}


export function cacheFulfilledObservablePipe<GValue>(
  maxNumberOfValues?: number,
): IObservablePipe<IDefaultNotificationsUnion<GValue>, IDefaultNotificationsUnion<GValue>> {
  return (subscribe: IObservable<IDefaultNotificationsUnion<GValue>>): IObservable<IDefaultNotificationsUnion<GValue>> => {
    return cacheFulfilledObservable<GValue>(subscribe, maxNumberOfValues);
  };
}
