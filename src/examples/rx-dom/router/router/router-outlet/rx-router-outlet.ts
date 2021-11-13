import {
  abortSignalPromiseBranching, createAbortError, createErrorNotification, createNextNotification, createTimeout,
  fromEventTarget, IDefaultNotificationsUnion, idle, IObserver, IObservable, IUnsubscribe,
  STATIC_COMPLETE_NOTIFICATION
} from '@lifaon/rx-js-light';
import { createElementNode } from '@lifaon/rx-dom';
import { createNotAbleToLocateRouterOutletError } from '../errors/not-able-to-locate-router-outlet-error/not-able-to-locate-router-outlet-error';

export const ROUTER_OUTLET_TAG_NAME = 'rx-router-outlet';

export function generateRouterOutletHTML(
  tagName: string = ROUTER_OUTLET_TAG_NAME,
): string {
  return `<${ tagName }></${ tagName }/>`;
}

export function createRouterOutletElement(
  tagName: string = ROUTER_OUTLET_TAG_NAME,
): HTMLElement {
  return createElementNode(tagName);
}


export function normalizeRouterOutletSelector(
  optionalRouterOutletSelector: string | undefined,
) {
  return optionalRouterOutletSelector ?? ROUTER_OUTLET_TAG_NAME;
}

export function locateRouterOutletElement(
  routerOutletSelector: string,
  parentNode: ParentNode,
  signal: AbortSignal,
  timeout: number = 200,
): Promise<HTMLElement> {
  return abortSignalPromiseBranching<HTMLElement>(signal, (signal: AbortSignal): Promise<HTMLElement> => {
    return new Promise<HTMLElement>((
      resolve: (value: HTMLElement) => void,
      reject: (reason?: any) => void,
    ): void => {
      const end = () => {
        unsubscribeAbort();
        unsubscribeIdle();
        unsubscribeTimeout();
      };

      const _resolve = (value: HTMLElement) => {
        end();
        resolve(value);
      };

      const _reject = (error: any) => {
        end();
        reject(error);
      };

      const unsubscribeTimeout = createTimeout(() => {
        _reject(createNotAbleToLocateRouterOutletError({ message: `Not able to locate the router outlet '${ routerOutletSelector }'` }));
      }, timeout);

      const unsubscribeAbort = fromEventTarget(signal, 'abort')(() => {
        _reject(createAbortError({ signal }));
      });

      const unsubscribeIdle = idle()(() => {
        const routerOutletElement: HTMLElement | null = parentNode.querySelector(routerOutletSelector);
        if (routerOutletElement !== null) {
          _resolve(routerOutletElement);
        }
      });
    });
  });
}


export function locateRouterOutletElementObservable(
  routerOutletSelector: string,
  parentNode: ParentNode,
  timeout: number = 200,
): IObservable<IDefaultNotificationsUnion<HTMLElement>> {
  return (emit: IObserver<IDefaultNotificationsUnion<HTMLElement>>): IUnsubscribe => {
    let running: boolean = true;

    const clear = () => {
      if (running) {
        running = false;
        unsubscribeTimeout();
        unsubscribeIdle();
      }
    };

    const unsubscribeTimeout = createTimeout(() => {
      clear();
      emit(createErrorNotification(createNotAbleToLocateRouterOutletError({ message: `Not able to locate the router outlet '${ routerOutletSelector }'` })));
    }, timeout);

    const unsubscribeIdle = idle()(() => {
      const routerOutletElement: HTMLElement | null = parentNode.querySelector(routerOutletSelector);
      if (routerOutletElement !== null) {
        clear();
        emit(createNextNotification(routerOutletElement));
        emit(STATIC_COMPLETE_NOTIFICATION);
      }
    });

    return clear;
  };
}

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
