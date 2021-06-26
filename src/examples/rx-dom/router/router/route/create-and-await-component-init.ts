import { HTMLElementConstructor, OnInit } from '@lifaon/rx-dom';
import { createAbortError, fromEventTarget, wrapPromiseFactoryWithAbortSignal } from '@lifaon/rx-js-light';

export interface IComponentWithOptionalOnInit extends HTMLElement, Partial<OnInit> {
}

export function createAndAwaitComponentInit(
  componentConstructor: HTMLElementConstructor,
  signal: AbortSignal,
): Promise<HTMLElement> {
  return wrapPromiseFactoryWithAbortSignal<HTMLElement>((signal: AbortSignal) => {
    return new Promise<HTMLElement>((
      resolve: (value: HTMLElement) => void,
      reject: (reason?: any) => void,
    ): void => {
      const component: IComponentWithOptionalOnInit = new componentConstructor();
      const onInit: OnInit['onInit'] | undefined = component.onInit;

      const end = (triggerInit: boolean) => {
        unsubscribeAbort();
        if (onInit !== void 0) {
          component.onInit = onInit;
          if (triggerInit) {
            onInit.call(component);
          }
        }
      };

      const _resolve = (value: HTMLElement) => {
        end(true);
        resolve(value);
      };


      const _reject = (error: any) => {
        end(false);
        reject(error);
      };

      const unsubscribeAbort = fromEventTarget(signal, 'abort')(() => {
        _reject(createAbortError({ signal }));
      });

      component.onInit = () => {
        _resolve(component);
      };
    });
  }, signal);
}
