import {
  createAbortError, createTimeout, fromEventTarget, idle, wrapPromiseFactoryWithAbortSignal
} from '@lifaon/rx-js-light';
import { createElementNode } from '@lifaon/rx-dom';
import { createRXDomRouterError } from './create-rx-dom-router-error';

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
  return wrapPromiseFactoryWithAbortSignal<HTMLElement>((signal: AbortSignal) => {
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
        _reject(createRXDomRouterError(1, `Not able to locate the router outlet '${ routerOutletSelector }'`));
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
  }, signal);
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
