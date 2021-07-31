import { fromEventTarget, IUnsubscribeFunction } from '@lifaon/rx-js-light';
import { subscribeOnNodeConnectedTo } from '@lifaon/rx-dom';
import { MatOverlayComponent } from '../mat-overlay.component';

export function makeMatOverlayComponentBackdropClosable(
  node: MatOverlayComponent,
): IUnsubscribeFunction {
  return subscribeOnNodeConnectedTo(
    node,
    fromEventTarget<'click', MouseEvent>(node, 'click'),
    (event: MouseEvent): void => {
      if (event.currentTarget === event.target) {
        node.close('backdrop');
      }
    },
  );
}
