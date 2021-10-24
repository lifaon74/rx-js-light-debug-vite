import { empty, fromEventTarget, IUnsubscribeFunction, merge } from '@lifaon/rx-js-light';
import {
  getDocument, removeStyleProperty, setReactiveProperty, setStyleProperty, subscribeOnNodeConnectedTo
} from '@lifaon/rx-dom';
import { MatOverlayComponent } from '../mat-overlay.component';
import { cloneEvent } from '../../../../../../misc/clone-event';

export interface IMakeMatOverlayComponentBackdropClosableOptions {
  dispatchEventOnClose?: boolean;
}

export function makeMatOverlayComponentBackdropClosable(
  node: MatOverlayComponent,
  {
    dispatchEventOnClose = true,
  }: IMakeMatOverlayComponentBackdropClosableOptions = {},
): IUnsubscribeFunction {
  const subscribeToPointerEventsProperty = (): IUnsubscribeFunction => {
    let running: boolean = true;
    // const originalValue: string = node.style.getPropertyValue('pointer-events');
    // const originalPriority: string = node.style.getPropertyPriority('pointer-events');
    setStyleProperty(node, 'pointer-events', 'auto');
    return () => {
      if (running) {
        running = false;
        removeStyleProperty(node, 'pointer-events');
        // node.style.setProperty('pointer-events', originalValue, originalPriority);
      }
    };
  }


  const unsubscribe = subscribeOnNodeConnectedTo(
    node,
    merge([
      fromEventTarget<'pointerdown', PointerEvent>(node, 'pointerdown'),
      subscribeToPointerEventsProperty,
    ]),
    (event: PointerEvent): void => {
      if (event.currentTarget === event.target) {
        unsubscribe();
        node.close('backdrop');

        if (dispatchEventOnClose) {
          const element: HTMLElement | null = getDocument().elementFromPoint(event.clientX, event.clientY) as HTMLElement | null;
          if (element !== null) {
            if (typeof element.focus === 'function') {
              setTimeout(() => element.focus(), 0);
            } else if (typeof element.click === 'function') {
              setTimeout(() => element.click(), 0);
            } else {
              element.dispatchEvent(cloneEvent(event));
            }
          }
        }
      }
    },
  );

  return unsubscribe;
}
