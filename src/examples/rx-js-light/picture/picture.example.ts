import {
  $log, andM$$, combineLatest, createMulticastReplaySource, createNetworkErrorFromResponse, createNotification,
  createReplaySource,
  defaultNotificationObserver,
  fromFetch, fromPromise,
  fulfilled$$$, futureUnsubscribe, IDefaultNotificationsUnion, IMulticastReplaySource, IObservable, IObserver,
  isErrorNotification,
  IUnsubscribe,
  mergeMapSingleObservable, noop, pipe$$,
  pipeObservable,
  shareObservable,
  shareR$$$,
  single, singleN,
  throwError,
} from '@lirx/core';
import { maxSizeElement } from './conditions/size/element/max-size-element';


// function isWindow(
//   value: any,
// ): value is Window {
//   return (value instanceof Window);
// }
//
//
// /** SOURCE **/
//
// const SOURCE_LOAD_AND_CACHE_CACHE = new Map<string, IObservable<IOptionalSource>>();
//
// function sourceLoadAndCache(
//   subscribe: IObservable<IOptionalSource>,
// ): IObservable<IOptionalSource> {
//   return mergeMapS$$<IOptionalSource, IOptionalSource>(subscribe, (src: IOptionalSource): IObservable<IOptionalSource> => {
//     if (src === void 0) {
//       return single(void 0);
//     } else {
//       if (src.startsWith('data:')) {
//         return single(src);
//       } else {
//         let cached: IObservable<IOptionalSource> | undefined = SOURCE_LOAD_AND_CACHE_CACHE.get(src);
//         if (cached === void 0) {
//           cached = mapFilter$$(fromPromise(sourceToDataURL(src)), (notification: IFromPromiseObservableNotifications<string>): IOptionalSource | IMapFilterDiscard => {
//             switch (notification.name) {
//               case 'error':
//                 return void 0;
//               case 'next':
//                 return notification.value;
//               case 'complete':
//                 return MAP_FILTER_DISCARD;
//             }
//           });
//           SOURCE_LOAD_AND_CACHE_CACHE.set(src, cached as IObservable<IOptionalSource>);
//         }
//         return cached as IObservable<IOptionalSource>;
//       }
//     }
//   });
// }
//
//
//
// export function mediaSourceForInvisibleElement(
//   element: Element,
// ): IObservable<IOptionalSource> {
//   return mediaSourceWithConditions('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>', [elementInvisible(element)]);
// }


/*---------------------*/

// function samplePicture$$(
//   element: Element,
// ): IObservable<IOptionalSource> {
//   const root: string = '/assets/images/dynamic';
//
//   const source0 = mediaSourceForInvisibleElement(element);
//   const source100$ = mediaSourceWithConditions(`${ root }/sample-100.jpg`, [maxSizeElement(element, { width: 100, height: 67 })]);
//   const source500$ = mediaSourceWithConditions(`${ root }/sample-500.jpg`, [maxSizeElement(element, { width: 500, height: 336 })]);
//   const source1000$ = mediaSourceWithConditions(`${ root }/sample-1000.jpg`, [maxSizeElement(element, { width: 1000, height: 671 })]);
//   const source2000$ = mediaSourceWithConditions(`${ root }/sample-2000.jpg`, [maxSizeElement(element, { width: 2000, height: 1342 })]);
//   const sourceNative$ = mediaSource(`${ root }/sample-native.jpg`);
//
//   return sourceLoadAndCache(selectFirstValidMediaSource([
//     source0,
//     source100$,
//     source500$,
//     source1000$,
//     source2000$,
//     sourceNative$,
//   ]));
// }


/*---------------------*/



export function cacheFulfilledObservable<GValue>(
  subscribe: IObservable<IDefaultNotificationsUnion<GValue>>,
  maxNumberOfValues?: number,
): IObservable<IDefaultNotificationsUnion<GValue>> {
  let requiresSubscription: boolean = true;
  const source: IMulticastReplaySource<IDefaultNotificationsUnion<GValue>> = createMulticastReplaySource<IDefaultNotificationsUnion<GValue>>(maxNumberOfValues);

  return (emit: IObserver<IDefaultNotificationsUnion<GValue>>): IUnsubscribe => {

    if (requiresSubscription) {
      requiresSubscription = false;

      futureUnsubscribe((
        unsubscribe: IUnsubscribe,
      ): IUnsubscribe => {
        return subscribe((value: IDefaultNotificationsUnion<GValue>): void => {
          source.emit(value);
          switch (value.name) {
            case 'complete':
              unsubscribe();
              break;
            case 'error':
              unsubscribe();
              source.reset();
              requiresSubscription = true;
              break;
          }
        });
      });
    }

    return source.subscribe(emit);
  };


  // const source
  // shareObservable()
  // createReplaySource()

  // return shareObservable<IDefaultNotificationsUnion<GValue>>(subscribe, {
  //   getSource: () => createMulticastReplaySource(maxNumberOfValues),
  // });

  // return (emit: IObserver<IDefaultNotificationsUnion<GValue>>): IUnsubscribe => {
  //   return subscribe(() => {
  //
  //   });
  // };
}

// export function sourceObservable<GValue>(
//   subscribe: IObservable<GValue>,
//   {
//     getSource,
//     subscribePoint = 1,
//     unsubscribePoint = (subscribePoint - 1),
//   }: ISourceObservableOptions<GValue>,
// ): IObservable<GValue> {
//   let unsubscribe: IUnsubscribe;
//   let observersCounts: number = 0;
//   const source: ISource<GValue> = getSource();
//   return (emit: IObserver<GValue>): IUnsubscribe => {
//     let running: boolean = true;
//     observersCounts++;
//     const unsubscribeSource: IUnsubscribe = source.subscribe(emit);
//     if (observersCounts === subscribePoint) {
//       unsubscribe = subscribe((value: GValue): void => {
//         source.emit(value);
//       });
//     }
//     return (): void => {
//       if (running) {
//         running = false;
//         unsubscribeSource();
//         observersCounts--;
//         if (observersCounts < unsubscribePoint) {
//           unsubscribe();
//         }
//       }
//     };
//   };
// }


export const EMPTY_SRC$ = singleN('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg"/>');


export function src$$(
  src: string,
): IObservable<IDefaultNotificationsUnion<string>> {
  return pipe$$(fromFetch(src), [
    fulfilled$$$<Response, IDefaultNotificationsUnion<string>>((response: Response): IObservable<IDefaultNotificationsUnion<string>> => {
      if (response.ok) {
        const contentType: string = response.headers.get('content-type') as string;
        return pipe$$(fromPromise(response.arrayBuffer()), [
          fulfilled$$$((buffer: ArrayBuffer): IObservable<IDefaultNotificationsUnion<string>> => {
            const data: string = btoa(String.fromCharCode(...new Uint8Array(buffer)));
            return singleN(`data:${contentType};base64,${data}`);
          }),
        ]);
      } else {
        return throwError(createNetworkErrorFromResponse(response));
      }
    }),
    shareR$$$<IDefaultNotificationsUnion<string>>(),
    // then$$$(
    //   (data: string): IObservable<IDefaultNotificationsUnion<string>> => {
    //     return singleN(data);
    //   },
    //   throwError,
    // )
  ]);
}

// export function multiConditionalObservable<GValue>(
//   subscribe: IObservable<GValue>,
//   conditions: IObservable<boolean>[],
// ): IObservable<GValue> {
//   return conditionalObservable<GValue>(
//     subscribe,
//     andM$$(...conditions),
//   );
// }
// anyWithNotifications

export type ISrcAndCondition = [
  src$: IObservable<IDefaultNotificationsUnion<string>>,
  condition$: IObservable<boolean>,
]

export function selectFirstSrcToMeetCondition(
  data: ISrcAndCondition[],
): IObservable<IDefaultNotificationsUnion<string>> {
  return mergeMapSingleObservable(
    combineLatest<readonly IObservable<boolean>[]>(
      data.map(([, condition$]) => condition$),
    ),
    (
      values: readonly boolean[],
    ): IObservable<IDefaultNotificationsUnion<string>> => {
      for (let i = 0, l = values.length; i < l; i++) {
        if (values[i]) {
          return data[i][0];
        }
      }
      return EMPTY_SRC$;
    },
  );
}


/*---------------------*/

export function pictureExample() {

  const container = document.createElement('div');

  const aspectRatio: number = 3670 / 2462;

  document.body.appendChild(container);

  // container.style.setProperty('width', '500px');
  // container.style.setProperty('height', '500px');

  container.style.setProperty('width', '100%');
  // container.style.setProperty('height', '100%');
  container.style.setProperty('aspect-ratio', `${aspectRatio} / 1`);

  container.style.setProperty('background-repeat', 'no-repeat');
  container.style.setProperty('background-position', 'center center');
  container.style.setProperty('background-size', 'contain');


  /*-------*/

  const maxWidth = (width: number): IObservable<boolean> => {
    return maxSizeElement(container, { width, height: width / aspectRatio });
  };

  const root: string = '/assets/images/dynamic';

  const src100$ = src$$(`${root}/sample-100.jpg`);
  const src100Condition$ = andM$$(maxWidth(100));
  const source500$ = src$$(`${root}/sample-500.jpg`);
  const src500Condition$ = andM$$(maxWidth(500));
  const source1000$ = src$$(`${root}/sample-1000.jpg`);
  const src1000Condition$ = andM$$(maxWidth(1000));
  const source2000$ = src$$(`${root}/sample-2000.jpg`);
  const src2000Condition$ = andM$$(maxWidth(2000));
  const sourceNative$ = src$$(`${root}/sample-native.jpg`);
  const srcNativeCondition$ = single(true);

  const picture$ = selectFirstSrcToMeetCondition([
    [src100$, src100Condition$],
    [source500$, src500Condition$],
    [source1000$, src1000Condition$],
    [source2000$, src2000Condition$],
    [sourceNative$, srcNativeCondition$],
  ]);

  // picture$($log);

  picture$(defaultNotificationObserver((src: string) => {
    container.style.setProperty('background-image', `url(${src})`);
  }));

  // const container = document.createElement('div');
  //
  // const picture$ = samplePicture$$(container);
  //
  // document.body.appendChild(container);
  //
  // // container.style.setProperty('width', '500px');
  // // container.style.setProperty('height', '500px');
  //
  // container.style.setProperty('width', '100%');
  // // container.style.setProperty('height', '100%');
  // container.style.setProperty('aspect-ratio', '3670 / 2462');
  //
  // container.style.setProperty('background-repeat', 'no-repeat');
  // container.style.setProperty('background-position', 'center center');
  // container.style.setProperty('background-size', 'contain');
  //
  // picture$((src: IOptionalSource) => {
  //   // console.log('change', src);
  //   if (src === void 0) {
  //     container.style.removeProperty('background-image');
  //   } else {
  //     container.style.setProperty('background-image', `url(${ src })`);
  //   }
  // });
}
