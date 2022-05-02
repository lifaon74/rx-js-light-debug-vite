import { fromEventTarget, IUnsubscribe } from '@lirx/core';
import { subscribeOnNodeConnectedTo } from '@lirx/dom';
import { MatOverlayComponent } from '../mat-overlay.component';

export function makeMatOverlayComponentClosableWithEscape(
  node: MatOverlayComponent,
): IUnsubscribe {
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
