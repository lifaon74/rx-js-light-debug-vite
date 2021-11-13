import {
  fromEventTarget, fromPromise, fromPromiseFactory, IObservableFromPromiseFactoryNotifications,
  mergeMapObservablePipe,
  pipeObservable, Subscription
} from '@lifaon/rx-js-light';



export function rxjsLightNotificationsExample() {
  const request = fromPromiseFactory(() => Promise.resolve(true));

  request((notification: IObservableFromPromiseFactoryNotifications<boolean>) => {
    console.log(notification);
  });


  // pipeObservable(request, [
  //   mergeMapObservablePipe<>()
  // ])
}
