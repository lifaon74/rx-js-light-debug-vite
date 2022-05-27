import {
  createElement, getElementStyleDeclaration, removeStyleProperty, setStyleProperty,
} from '@lirx/dom';
import { fromEventTarget } from '@lirx/core';

/** FUNCTIONS **/

export interface ICreateRippleOptions {
  x: number;
  y: number;
  radius: number;
  color: string;
  openDuration?: number;
  closeDuration?: number;
}

export interface IRipple {
  element: HTMLElement;
  open: () => Promise<void>;
  close: () => Promise<void>;
}

export type IRippleState =
  | 'closed'
  | 'opening'
  | 'opened'
  | 'closing';

export function createRipple(
  {
    x,
    y,
    radius,
    color,
    openDuration = 1000,
    closeDuration = 200,
  }: ICreateRippleOptions,
): IRipple {
  const element: HTMLDivElement = createElement('div');
  const styleDeclaration: CSSStyleDeclaration = getElementStyleDeclaration(element);

  const left: string = `${x - radius}px`;
  const right: string = `${y - radius}px`;
  const size: string = `${radius * 2}px`;

  setStyleProperty(styleDeclaration, 'position', 'absolute');
  setStyleProperty(styleDeclaration, 'left', left);
  setStyleProperty(styleDeclaration, 'top', right);
  setStyleProperty(styleDeclaration, 'width', size);
  setStyleProperty(styleDeclaration, 'height', size);
  setStyleProperty(styleDeclaration, 'background-color', color);
  setStyleProperty(styleDeclaration, 'border-radius', '50%');

  let state: IRippleState = 'closed';

  const open = (): Promise<void> => {
    return new Promise<void>((
      resolve: () => void,
      reject: (reason?: any) => void,
    ): void => {
      if (state === 'closed') {
        state = 'opening';

        removeStyleProperty(styleDeclaration, 'transition');
        // setStyleProperty(styleDeclaration, 'transform', 'scale(0.5)');
        // setStyleProperty(styleDeclaration, 'opacity', '0.5');
        setStyleProperty(styleDeclaration, 'transform', 'scale(0)');
        setStyleProperty(styleDeclaration, 'opacity', '0');
        setStyleProperty(styleDeclaration, 'transition', `transform ${openDuration}ms, opacity ${closeDuration}ms`);

        const _resolve = (): void => {
          unsubscribe();
          state = 'opened';
          resolve();
        };

        const transitionend$ = fromEventTarget(element, 'transitionend');

        const unsubscribe = transitionend$(_resolve);

        requestAnimationFrame(() => {
          setStyleProperty(styleDeclaration, 'opacity', '1');
          setStyleProperty(styleDeclaration, 'transform', 'scale(1)');
        });
      } else {
        reject(new Error(`Current state is not closed: ${state}`));
      }
    });
  };

  const close = (): Promise<void> => {
    return new Promise<void>((
      resolve: () => void,
      reject: (reason?: any) => void,
    ): void => {
      if (state === 'opened') {
        state = 'closing';

        const _resolve = (): void => {
          unsubscribe();
          state = 'closed';
          resolve();
        };

        const transitionend$ = fromEventTarget(element, 'transitionend');

        setStyleProperty(styleDeclaration, 'opacity', '0');

        const unsubscribe = transitionend$(_resolve);
      } else {
        reject(new Error(`Current state is not opened: ${state}`));
      }
    });
  };

  return {
    element,
    open,
    close,
  };
}
