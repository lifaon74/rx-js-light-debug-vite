import { fromEventTarget, IUnsubscribeFunction } from '@lifaon/rx-js-light';
import { subscribeOnNodeConnectedTo } from '@lifaon/rx-dom';
import { MatOverlayComponent } from '../mat-overlay.component';

export function makeMatOverlayComponentBackdropClosable(
  node: MatOverlayComponent,
): IUnsubscribeFunction {
  const originalValue: string = node.style.getPropertyValue('pointer-events');
  const originalPriority: string = node.style.getPropertyPriority('pointer-events');
  node.style.setProperty('pointer-events', 'auto');

  const unsubscribe = subscribeOnNodeConnectedTo(
    node,
    fromEventTarget<'click', MouseEvent>(node, 'click'),
    (event: MouseEvent): void => {
      if (event.currentTarget === event.target) {
        node.close('backdrop');
      }
    },
  );

  return () => {
    unsubscribe();
    node.style.setProperty('pointer-events', originalValue, originalPriority);
  };
}
