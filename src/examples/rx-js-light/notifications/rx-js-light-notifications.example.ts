import {
  fromEventTarget, fromPromise, fromPromiseFactory, IFromPromiseFactoryObservableNotifications,
  mergeMapObservablePipe,
  pipeObservable, Subscription
} from '@lifaon/rx-js-light';



export function rxjsLightNotificationsExample() {
  const request = fromPromiseFactory(() => Promise.resolve(true));

  request((notification: IFromPromiseFactoryObservableNotifications<boolean>) => {
    console.log(notification);
  });


  // pipeObservable(request, [
  //   mergeMapObservablePipe<>()
  // ])
}
