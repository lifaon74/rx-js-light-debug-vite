import {
  createEventListener, IObservable, IObserver, IUnsubscribe, mergeUnsubscribeFunctions,
} from '@lifaon/rx-js-light';
import { getOnlineState } from './get-online-state';


export function onlineObservable(): IObservable<boolean> {
  return (emit: IObserver<boolean>): IUnsubscribe => {
    emit(getOnlineState());

    return mergeUnsubscribeFunctions([
      createEventListener<'online', Event>(window, 'online', (): void => {
        emit(true);
      }),
      createEventListener<'offline', Event>(window, 'offline', (): void => {
        emit(false);
      }),
    ]);
  };
}

// export function onlineObservable(): IObservable<boolean> {
//   return merge([
//     reference<boolean>(() => navigator.onLine),
//     map$$(fromEventTarget(window, 'online'), () => true),
//     map$$(fromEventTarget(window, 'offline'), () => false),
//   ]);
// }

