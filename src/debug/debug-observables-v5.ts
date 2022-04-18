import {
  composeObserverPipes, createMulticastReplayLastSource, createMulticastSource, createNetworkError,
  createObservableProxy, createUnicastReplayLastSource, distinctObservablePipe, distinctObserverPipe, finally$$$,
  fromFetch,
  fromPromise, fulfilled$$$, IDefaultNotificationsUnion, IObservable, IFromPromiseObservableNotifications,
  IObservableProxy,
  IUnsubscribe, mapObservablePipe, mapObserverPipe, of, pipe$$, pipeObservablePipes, singleWithNotifications, then$$$,
  throwError, timeout, map$$, singleN, emptyN, IEmptyObservableNotifications, mergeMapS$$, ofWithNotifications,
  toAsyncIterable, fromAsyncIterable, raceWithNotifications, let$$,
} from '@lirx/core';
import { noCORS } from '../examples/misc/no-cors';
import { sleep } from '../examples/misc/sleep';

function unsubscribeIn(unsubscribe: IUnsubscribe, ms: number): void {
  setTimeout(unsubscribe, ms);
}


export function $timeout(ms: number): Promise<void> {
  return new Promise<void>((resolve: any) => {
    setTimeout(resolve, ms);
  });
}


/*------*/

// async function debugObservable1() {
//   const unsubscribe = pipeObservableSpread(
//     interval(500),
//     mapOperator<void, number>(() => Math.random()),
//     filterOperator<number>((value: number) => (value < 0.5))
//   )((value: number) => {
//     console.log('value', value);
//   });
//
//   unsubscribeIn(unsubscribe, 2000);
// }
//
// async function debugObservable2() {
//   const subscribe = pipeObservable(interval(500), [
//     logOperator<void>('timer'),
//     mapOperator<void, number>(() => Math.random()),
//     shareOperator<number>(),
//   ]);
//
//   const unsub1 = subscribe(((value: number) => {
//     console.log('value1', value);
//   }));
//
//   const unsub2 = subscribe(((value: number) => {
//     console.log('value2', value);
//   }));
//
//   unsubscribeIn(unsub1, 2000);
//   unsubscribeIn(unsub2, 4000);
// }
//
// async function debugObservable3() {
//   const subscribe = pipeObservable(fromFetch(noCORS(`https://www.w3.org/TR/PNG/iso_8859-1.txt`)), [
//     shareOperator<IObservableFromFetchNotifications>()
//   ]);
//
//   subscribe(
//     notificationObserver({
//       next: (response: Response) => {
//         console.log(response);
//       },
//       complete: () => {
//         console.log('done');
//       }
//     })
//   );
//
//   console.log(await toPromise(subscribe));
// }
//
// async function debugObservable4() {
//   const blob = new Blob([new Uint8Array([0, 1, 2, 3])]);
//   type GNotifications = IObservableReadBlobNotifications<'array-buffer'>;
//   const subscribe = pipeObservableSpread(
//     readBlob(blob, 'array-buffer'),
//     shareOperator<GNotifications>()
//   );
//
//   subscribe((notification: GNotifications) => {
//     console.log(notification);
//   });
//
//   console.log(await toPromise(subscribe));
// }
//
// async function debugObservable5() {
//   fromAsyncIterable((async function * generator() {
//     for (let i = 0; i < 10; i++) {
//       yield i;
//     }
//     // throw new Error('failed');
//   })())((notification: any) => {
//     console.log(notification);
//   });
// }
//
// async function debugObservable6() {
//   const response = await fetch(`https://file-examples-com.github.io/uploads/2017/02/zip_10MB.zip`);
//
//   fromReadableStreamReader((response.body as ReadableStream).getReader())((notification: any) => {
//     console.log(notification);
//   });
// }
//
// async function debugObservable7() {
//   // https://reqres.in/
//   // https://file-examples.com/index.php/text-files-and-archives-download/
//
//   // const request = new Request(noCORS(`https://www.w3.org/TR/PNG/iso_8859-1.txt`)); // basic get
//   // const request = new Request(`https://reqres.in/api/users`, { // 100MB upload
//   //   method: 'POST',
//   //   body: new Blob([new Uint8Array(1e8)]) // 100MB
//   // });
//
//   const request = new Request(`https://file-examples-com.github.io/uploads/2017/02/zip_10MB.zip`); // 10MB download
//
//   const subscribe = pipeObservableSpread(
//     fromXHR(request),
//     shareOperator<IObservableFromXHRNotifications>()
//   );
//
//   subscribe((notification: IObservableFromXHRNotifications) => {
//     console.log(notification);
//   });
//
//   subscribe(
//     notificationObserver({
//       next: (response: Response) => {
//         let size: number = 0;
//         const subscribe = fromReadableStreamReader((response.body as ReadableStream).getReader());
//         subscribe(
//           notificationObserver({
//             next: (chunk: Uint8Array) => {
//               size += chunk.byteLength;
//             },
//             complete: () => {
//               console.log('size', size);
//             },
//           })
//         );
//       }
//     })
//   );
//
//   console.log(await toPromise(subscribe));
// }
//
// async function debugObservable8() {
//   const sub1 = pipeObservable(interval(500), [
//     mapOperator(() => Math.random()),
//   ]);
//   const sub2 = pipeObservableSpread(
//     interval(500),
//     mapOperator(() => Math.random())
//   );
//
//   const subscribe = pipeObservableSpread(
//     reactiveSum([sub1, sub2]),
//     debounceOperator<number>(0),
//   );
//
//   const unsubscribe = subscribe((value: number) => {
//     console.log(value);
//   });
//
//   await $timeout(2000);
//   unsubscribe();
// }
//
// async function debugObservable9() {
//   // const request = new Request(`https://file-examples-com.github.io/uploads/2017/02/zip_10MB.zip`); // 10MB download
//   const request = new Request(`https://fakedomain.com`);
//
//   const subscribe = pipeObservable(fromFetch(request), [
//     thenOperator(
//       (response: Response) => {
//         if (response.ok) {
//           return fromPromise(response.blob());
//         } else {
//           return throwError(createNetworkErrorFromRequest(request));
//         }
//       },
//       (error: any) => {
//         console.log('caught error', error);
//         return throwError(createNetworkErrorFromRequest(request));
//       }
//     ),
//     fulfilledOperator((blob: Blob) => {
//       return readBlob(blob, 'array-buffer');
//     }),
//     fulfilledOperator((data: ArrayBuffer) => {
//       return throwError(createNetworkErrorFromRequest(request));
//     }),
//     // rejectedOperator<Blob>((error: any) => {
//     //   console.log('error catched');
//     //   return throwError(error);
//     // }),
//     // multicastOperator<IThenOperatorOutNotifications<Blob>>(),
//   ]);
//
//   subscribe((value: any) => {
//     console.log(value);
//   });
//
//   // subscribe(
//   //   notificationObserver({
//   //     next: (response: Blob) => {
//   //       console.log(response);
//   //     },
//   //     complete: () => {
//   //       console.log('done');
//   //     }
//   //   })
//   // );
//
//   // subscribe((notification: DN) => {
//   //   console.log(notification);
//   // });
// }
//
//
// async function debugObservable10() {
//   const obj: any = { a: 'a', b: { c: 'c' } };
//   type TValue = string | undefined;
//
//   const subscribe = pipeObservable(expression<TValue>((): TValue => obj.b?.c), [
//     shareOperator<TValue>()
//   ]);
//
//   const unsubscribe = subscribe((value: TValue): void => {
//     console.log(value);
//   });
//
//   await $timeout(1000);
//   obj.b.c = 'd';
//
//   await $timeout(1000);
//   obj.b = null;
//
//   await $timeout(1000);
//   unsubscribe();
// }
//
// async function debugObservable11() {
//
//   const source = createSource<number>();
//
//   const subscribe = pipeObservable(source.subscribe, [
//     // replayLastSharedOperator<number>()
//     replaySharedOperator<number>(3)
//   ]);
//
//   const unsubscribe1 = subscribe((value: number): void => {
//     console.log('subscription 1', value);
//   });
//
//   for (let i = 0; i < 10; i++) {
//     source.emit(i);
//   }
//
//   const unsubscribe2 = subscribe((value: number): void => {
//     console.log('subscription 2', value);
//   });
//
//   // source.emit(-1);
//
//   unsubscribe1();
//   unsubscribe2();
// }
//
//
// async function debugObservable12() {
//
//   interface IJSONResponse {
//     userId: number;
//     id: number;
//     title: string;
//     body: string;
//   }
//
//   // const a = mapObservablePipeWithNotifications<IObservableFromFetchNotifications, IObservable<IFromPromiseObservableNotifications<IJSONResponse>>>((response: Response) => fromPromise<IJSONResponse>(response.json()));
//   // const a = mapObservablePipeWithNotifications<Union<string>, IObservable<IFromPromiseObservableNotifications<IJSONResponse>>>((response: Response) => fromPromise<IJSONResponse>(response.json()));
//
//   // const a = mergeMapObservablePipeWithNotifications<IObservableFromFetchNotifications, IJSONResponse>((response: Response) => fromPromise<IJSONResponse>(response.json())),;
//
//   const subscribe = pipeObservable(fromEventTarget<'click', MouseEvent>(window, 'click'), [
//     debounceTimeObservablePipe<MouseEvent>(1000),
//     mergeMapObservablePipe<MouseEvent, IObservableFromFetchNotifications>(() => fromFetch('https://jsonplaceholder.typicode.com/posts/1'), 1),
//     mergeMapObservablePipeWithNotifications<IObservableFromFetchNotifications, IJSONResponse>((response: Response) => fromPromise<IJSONResponse>(response.json())),
//
//     // mapObservablePipeWithNotifications<IObservableFromFetchNotifications, IObservable<IFromPromiseObservableNotifications<IJSONResponse>>>((response: Response) => fromPromise<IJSONResponse>(response.json())),
//     // mergeAllObservablePipeWithNotifications<IJSONResponse>(),
//
//     // mergeAllObservablePipeWithNotifications<IJSONResponse>(),
//     // mergeMapObservablePipe<IObservableFromFetchNotifications, IDefaultNotificationsUnion<IJSONResponse>>((notification: IObservableFromFetchNotifications) => {
//     //   switch (notification.name) {
//     //     case 'next':
//     //       return fromPromise<IJSONResponse>(notification.value.json());
//     //     case 'complete':
//     //       return fromPromise<IJSONResponse>(notification.value.json());
//     //     default:
//     //       return of(notification);
//     //   }
//     // }),
//     // fulfilledObservablePipe<Response, IFromPromiseObservableNotifications<IJSONResponse>>((response: Response) => fromPromise<IJSONResponse>(response.json()))
//   ]);
//
//   // subscribe((notification/*: IDefaultNotificationsUnion<IJSONResponse>*/) => {
//   subscribe((notification) => {
//     console.log(notification);
//   });
// }


async function debugObservable13() {
  const request$ = fromFetch(noCORS(`https://www.w3.org/TR/PNG/iso_8859-1.txt`));

  // const subscribe = pipe$$(request$, [
  //   fulfilled$$$((response: Response): IObservable<IFromPromiseObservableNotifications<string>> => {
  //     if (response.ok) {
  //       return fromPromise(response.text());
  //     } else {
  //       return throwError(createNetworkError());
  //     }
  //   }),
  // ]);

  // const subscribe = pipe$$(throwError(new Error(`Rejected`)), [
  //   rejected$$$((error: any): IObservable<IDefaultNotificationsUnion<string>> => {
  //     if (navigator.onLine) {
  //       return throwError(error);
  //     } else {
  //       return singleWithNotifications('Offline');
  //     }
  //   }),
  // ]);


  // const subscribe = pipe$$(request$, [
  //   then$$$(
  //     (response: Response): IObservable<IFromPromiseObservableNotifications<string>> => {
  //       if (response.ok) {
  //         return fromPromise(response.text());
  //       } else {
  //         return throwError(createNetworkError());
  //       }
  //     },
  //     (error: any): IObservable<IDefaultNotificationsUnion<string>> => {
  //       if (navigator.onLine) {
  //         return throwError(error);
  //       } else {
  //         return singleWithNotifications('Offline');
  //       }
  //     }
  //   ),
  // ]);

  // const subscribe = pipe$$(request$, [
  //   fulfilled$$$((response: Response): IObservable<IFromPromiseObservableNotifications<string>> => {
  //     if (response.ok) {
  //       return fromPromise(response.text());
  //     } else {
  //       return throwError(createNetworkError());
  //     }
  //   }),
  // ]);

  // const subscribe = pipe$$(request$, [
  //   finally$$$((): IObservable<IEmptyObservableNotifications> => {
  //     return mergeMapS$$(timeout(2000), () => emptyN());
  //   }),
  // ]);


  const observable1$ = mergeMapS$$(timeout(500), () => singleN<'a1'>('a1'));
  const observable2$ = mergeMapS$$(timeout(1000), () => singleN<'a2'>('a2'));


  const subscribe = raceWithNotifications([observable1$, observable2$]);

  subscribe((value: IDefaultNotificationsUnion<'a1' | 'a2'>) => {
    console.log(value);
  });
}


async function debugObservable14() {
  function sleep(
    timeout: number,
  ): Promise<void> {
    return new Promise<void>((
      resolve: () => void,
    ): void => {
      setTimeout(resolve, timeout);
    });
  }

  // const values$ = fromAsyncIterable((async function * () {
  //   for (let i = 0; i < 4; i++) {
  //     await sleep(500);
  //     console.log('emit', i);
  //     yield i;
  //   }
  // })());

  const values$ = fromAsyncIterable((async function * () {
    let i = 0;
    while (true) {
      await sleep(500);
      console.log('emit', i);
      yield i;
      i++;
    }
  })());


  const iterable = toAsyncIterable(values$);

  // for await (const value of iterable) {
  //   console.log('receive', value);
  // }

  // let i = 0;
  // for await (const value of iterable) {
  //   console.log('receive', value);
  //   if (++i >= 2) {
  //     break;
  //   }
  // }


  let i = 0;
  // const iterator: AsyncGenerator<number> = iterable[Symbol.asyncIterator]();
  const iterator: AsyncGenerator<number> = iterable;
  let result: IteratorResult<number>;
  while (!(result = await iterator.next()).done) {
    console.log('receive', result.value);
    if (++i >= 2) {
      await iterator.return(void 0);
      break;
    }
  }
}

/*---------------------------*/

async function debugObserverPipes1() {
  const observerPipe = composeObserverPipes([
    distinctObserverPipe<number>(),
    mapObserverPipe<number, string>(String),
  ]);
  const emit = observerPipe((value: string) => {
    console.log('received', value);
  });
  emit(5);
  emit(1);
  emit(1);
}

async function debugObservablePipes1() {
  const subscribePipe = pipeObservablePipes([
    distinctObservablePipe<number>(),
    mapObservablePipe<number, string>(String),
  ]);

  const subscribe = subscribePipe(of(1, 2, 3, 3));

  const unsubscribe = subscribe((value: string) => {
    console.log('received', value);
  });
}

/*----*/

async function debugMulticastSource1() {
  const source = createMulticastSource<void>();

  const unsub1 = source.subscribe(() => {
    console.log('1');
    unsub2();
    // unsub1();
  });

  const unsub2 = source.subscribe(() => {
    console.log('2');
  });

  // const unsub3 = source.subscribe(() => {
  //   console.log('3');
  // });

  source.emit();
}

async function debugReplayLastSource1() {
  const source = createUnicastReplayLastSource<number>(0);

  source.subscribe((value: number) => {
    console.log('value - A:', value);
  });

  source.emit(2);

  source.subscribe((value: number) => {
    console.log('value - B:', value);
  });

}

async function debugSourcePerf1() {
  const test1 = () => {
    // 1447.72802734375 ms
    const source = createMulticastSource<void>();
    console.time('perf');
    let j: number = 0;
    for (let i = 0; i < 1e7; i++) {
      source.subscribe(() => {
        j++;
      });
    }
    source.emit();
    console.timeEnd('perf');
    console.log(j);
  };

  const test2 = () => {
    // 604.277099609375
    const source = createMulticastSource<void>();
    for (let i = 0; i < 1e6; i++) {
      source.subscribe(() => {
        j++;
      });
    }

    console.time('perf');
    let j: number = 0;
    for (let i = 0; i < 1e2; i++) {
      source.emit();
    }
    console.timeEnd('perf');
    console.log(j);
  };

  test1();
  // test2();
}


async function debugObservableProxy1() {
  interface IArrayItem {
    value: number;
  }

  const data = {
    a: {
      b: {
        c: 'c'
      },
      ba: 'b1',
    },
    a1: 3,
    a2: () => {
      return 5;
    },
    array: Array.from({ length: 5 }, (v: any, i: any): IArrayItem => {
      return {
        value: i,
      };
    }),
  };

  const $data$ = createMulticastReplayLastSource(data);

  const proxy = createObservableProxy($data$.subscribe);

  // (proxy.a1 as number) = 5;
  // // console.log(data);
  // console.log(proxy.a1 + 2);
  // console.log(proxy.a2());
  console.log(proxy.a === proxy.a); // false

  // proxy.a.b.c.$((value: any) => {
  //   console.log('c', value);
  // });

  const unsubscriptions: IUnsubscribe[] = [];

  proxy.array.$array((items: readonly IObservableProxy<any>[]) => {
    const itemsLength = items.length;
    const unsubscriptionsLength = unsubscriptions.length;
    if (unsubscriptionsLength < items.length) {
      unsubscriptions.length = unsubscriptionsLength;
      for (let i = unsubscriptionsLength; i < itemsLength; i++) {
        unsubscriptions[i] = items[i].value.$((value: any) => {
          console.log('value', value);
        });
      }
    }
  });


  // proxy.array.$$((items: IArrayItem[]) => {
  //   // console.log(items);
  //   debugger;
  //   for (let i = 0, l = items.length; i < l; i++) {
  //     console.log(items[i]);
  //   }
  //   // items.value.$((value: any) => {
  //   //   console.log('value', value);
  //   // });
  // });

  (window as any).setData = $data$.emit;
}

async function debugObservableProxy2() {
  const data: any = {
    array: [{ value: 1 }, { value: 2 }],
  };

  const dataSource = createMulticastReplayLastSource(data);

  const proxy = createObservableProxy(dataSource.subscribe);

  /* THE IMPORTANT PART */

// list of unsubscriptions for the received array
  const unsubscriptions: IUnsubscribe[] = [];

  proxy.array.$array((items: readonly IObservableProxy<any>[]) => {

    const itemsLength = items.length;
    const unsubscriptionsLength = unsubscriptions.length;

    // if the received array's length is larger than the subscriptions we've already done
    if (unsubscriptionsLength < items.length) {
      // increase 'unsubscriptions' size
      unsubscriptions.length = itemsLength;
      // and only subscribe to the new ones
      for (let i = unsubscriptionsLength; i < itemsLength; i++) {
        // note that 'items[i]' is a proxy
        unsubscriptions[i] = items[i].value.$((value: any) => {
          console.log('value', value);
        });
      }
    } else { // if the received array's length is smaller than the subscriptions we've already done
      // unsubscribe from the old ones
      for (let i = itemsLength; i < unsubscriptionsLength; i++) {
        unsubscriptions[i]();
      }
      // decrease 'unsubscriptions' size
      unsubscriptions.length = itemsLength;
    }
  });
  // outputs:
  // value: 1
  // value: 2

  dataSource.emit({ array: [{ value: 5 }, { value: 8 }] });
  // outputs:
  // value: 5
  // value: 8

  dataSource.emit({ array: [{}, { value: 9 }] });
  // outputs:
  // value: undefined
  // value: 9

  dataSource.emit({ array: [{ value: 0 }] });
  // outputs:
  // value: 0

  dataSource.emit({ array: [{ value: 0 }, { value: 1 }, { value: 2 }] });
  // outputs:
  // value: 0
  // value: 1
  // value: 2
}


/*----------------------------*/

export async function debugObservableV5() {
  // await test();

  // await debugObserverPipes1();
  // await debugObservablePipes1();

  // await debugObservable2();
  // await debugObservable3();
  // await debugObservable4();
  // await debugObservable5();
  // await debugObservable6();
  // await debugObservable7();
  // await debugObservable8();
  // await debugObservable9();
  // await debugObservable10();
  // await debugObservable11();
  // await debugObservable12();
  // await debugObservable13();
  // await debugObservable14();


  // await debugMulticastSource1();
  // await debugReplayLastSource1();
  // await debugSourcePerf1();
  // await debugObservableProxy1();
  // await debugObservableProxy2();
}
