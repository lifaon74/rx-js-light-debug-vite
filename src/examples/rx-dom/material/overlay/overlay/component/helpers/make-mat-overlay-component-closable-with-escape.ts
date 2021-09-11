import { fromEventTarget, IUnsubscribeFunction } from '@lifaon/rx-js-light';
import { subscribeOnNodeConnectedTo } from '@lifaon/rx-dom';
import { MatOverlayComponent } from '../mat-overlay.component';

export function makeMatOverlayComponentClosableWithEscape(
  node: MatOverlayComponent,
): IUnsubscribeFunction {
  return subscribeOnNodeConnectedTo(
    node,
    fromEventTarget<'keydown', KeyboardEvent>(window, 'keydown'),
    (event: KeyboardEvent): void => {
      if (event.key === 'Escape') {
        node.close('escape');
      }
    },
  );
}
