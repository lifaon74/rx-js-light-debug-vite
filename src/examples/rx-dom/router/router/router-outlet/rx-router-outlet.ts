import {
  IDefaultNotificationsUnion, idle, IObservable, IObserver, IUnsubscribe, mergeMapS$$, singleN,
} from '@lifaon/rx-js-light';

export const ROUTER_OUTLET_ATTRIBUTE_NAME = 'rx-router-outlet';

// export function generateRouterOutletHTML(
//   attributeName: string = ROUTER_OUTLET_ATTRIBUTE_NAME,
// ): string {
//   return `<div ${ attributeName }></div>`;
// }

// export function createRouterOutletElement(
//   attributeName: string = ROUTER_OUTLET_ATTRIBUTE_NAME,
// ): HTMLElement {
//   const element: HTMLElement = createElementNode('div');
//   setAttribute(element, attributeName, '');
//   return element;
// }


export function locateRouterOutletElement(
  routerOutletSelector: string,
  parentNode: ParentNode,
): IObservable<HTMLElement> {
  return (emit: IObserver<HTMLElement>): IUnsubscribe => {
    let running: boolean = true;

    const clear = (): void => {
      if (running) {
        running = false;
        unsubscribeIdle();
      }
    };

    const unsubscribeIdle = idle({ timeout: 500 })((): void => {
      const routerOutletElement: HTMLElement | null = parentNode.querySelector(routerOutletSelector);
      if (routerOutletElement !== null) {
        emit(routerOutletElement);
        clear();
      }
    });

    return clear;
  };
}

export function locateRouterOutletElementWithNotifications(
  routerOutletSelector: string,
  parentNode: ParentNode,
): IObservable<IDefaultNotificationsUnion<HTMLElement>> {
  return mergeMapS$$(
    locateRouterOutletElement(
      routerOutletSelector,
      parentNode,
    ),
    (routerOutletElement: HTMLElement): IObservable<IDefaultNotificationsUnion<HTMLElement>> => {
      return singleN(routerOutletElement);
    },
  );
}


// export function locateRouterOutletElement(
//   routerOutletSelector: string,
//   parentNode: ParentNode,
//   signal: AbortSignal,
// ): Promise<HTMLElement> {
//   return abortSignalPromiseBranching<HTMLElement>(signal, (signal: AbortSignal): Promise<HTMLElement> => {
//     return new Promise<HTMLElement>((
//       resolve: (value: HTMLElement) => void,
//       reject: (reason?: any) => void,
//     ): void => {
//       const end = () => {
//         unsubscribeAbort();
//         unsubscribeIdle();
//       };
//
//       const _resolve = (value: HTMLElement) => {
//         end();
//         resolve(value);
//       };
//
//       const _reject = (error: any) => {
//         end();
//         reject(error);
//       };
//
//       const unsubscribeAbort = fromEventTarget(signal, 'abort')(() => {
//         _reject(createAbortError({ signal }));
//       });
//
//       const unsubscribeIdle = idle()(() => {
//         const routerOutletElement: HTMLElement | null = parentNode.querySelector(routerOutletSelector);
//         if (routerOutletElement !== null) {
//           _resolve(routerOutletElement);
//         }
//       });
//     });
//   });
// }

// export function locateRouterOutletElement(
//   routerOutletSelector: string,
//   parentNode: ParentNode,
//   signal: AbortSignal,
//   timeout: number = 200,
// ): Promise<HTMLElement> {
//   return abortSignalPromiseBranching<HTMLElement>(signal, (signal: AbortSignal): Promise<HTMLElement> => {
//     return new Promise<HTMLElement>((
//       resolve: (value: HTMLElement) => void,
//       reject: (reason?: any) => void,
//     ): void => {
//       const end = () => {
//         unsubscribeAbort();
//         unsubscribeIdle();
//         unsubscribeTimeout();
//       };
//
//       const _resolve = (value: HTMLElement) => {
//         end();
//         resolve(value);
//       };
//
//       const _reject = (error: any) => {
//         end();
//         reject(error);
//       };
//
//       const unsubscribeTimeout = createTimeout(() => {
//         _reject(createNotAbleToLocateRouterOutletError({ message: `Not able to locate the router outlet '${ routerOutletSelector }'` }));
//       }, timeout);
//
//       const unsubscribeAbort = fromEventTarget(signal, 'abort')(() => {
//         _reject(createAbortError({ signal }));
//       });
//
//       const unsubscribeIdle = idle()(() => {
//         const routerOutletElement: HTMLElement | null = parentNode.querySelector(routerOutletSelector);
//         if (routerOutletElement !== null) {
//           _resolve(routerOutletElement);
//         }
//       });
//     });
//   });
// }

// export function locateRouterOutletElementObservable(
//   routerOutletSelector: string,
//   parentNode: ParentNode,
//   timeout: number = 200,
// ): IObservable<IDefaultNotificationsUnion<HTMLElement>> {
//   return (emit: IObserver<IDefaultNotificationsUnion<HTMLElement>>): IUnsubscribe => {
//     let running: boolean = true;
//
//     const clear = () => {
//       if (running) {
//         running = false;
//         unsubscribeTimeout();
//         unsubscribeIdle();
//       }
//     };
//
//     const unsubscribeTimeout = createTimeout(() => {
//       clear();
//       emit(createErrorNotification(createNotAbleToLocateRouterOutletError({ message: `Not able to locate the router outlet '${ routerOutletSelector }'` })));
//     }, timeout);
//
//     const unsubscribeIdle = idle()(() => {
//       const routerOutletElement: HTMLElement | null = parentNode.querySelector(routerOutletSelector);
//       if (routerOutletElement !== null) {
//         clear();
//         emit(createNextNotification(routerOutletElement));
//         emit(STATIC_COMPLETE_NOTIFICATION);
//       }
//     });
//
//     return clear;
//   };
// }

// export function locateRouterOutletElementObservable(
//   routerOutletSelector: string,
//   parentNode: ParentNode,
// ): IObservable<IDefaultNotificationsUnion<HTMLElement>> {
//   return (emit: IObserver<IDefaultNotificationsUnion<HTMLElement>>): IUnsubscribe => {
//     let running: boolean = true;
//
//     const clear = () => {
//       if (running) {
//         running = false;
//         unsubscribeIdle();
//       }
//     };
//
//     const unsubscribeIdle = idle()(() => {
//       const routerOutletElement: HTMLElement | null = parentNode.querySelector(routerOutletSelector);
//       if (routerOutletElement !== null) {
//         clear();
//         emit(createNextNotification(routerOutletElement));
//         emit(STATIC_COMPLETE_NOTIFICATION);
//       }
//     });
//
//     return clear;
//   };
// }

// export function locateRouterOutlet(
//   optionalRouterOutlet: string | undefined,
//   parentNode: ParentNode,
// ): Element | never {
//   const routerOutlet: string = normalizeRouterOutlet(optionalRouterOutlet);
//   const routerElement: Element | null = parentNode.querySelector(routerOutlet);
//   if (routerElement === null) {
//     throw new Error(`Unable to locate router element '${ routerOutlet }'`);
//   } else {
//     return routerElement;
//   }
// }
