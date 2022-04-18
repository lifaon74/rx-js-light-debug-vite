import {
  fromEventTarget, fromPromise, fromPromiseFactory, IFromPromiseFactoryObservableNotifications,
  mergeMapObservablePipe,
  pipeObservable, Subscription
} from '@lirx/core';



export function rxjsLightNotificationsExample() {
  const request = fromPromiseFactory(() => Promise.resolve(true));

  request((notification: IFromPromiseFactoryObservableNotifications<boolean>) => {
    console.log(notification);
  });


  // pipeObservable(request, [
  //   mergeMapObservablePipe<>()
  // ])
}
