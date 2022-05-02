import { MatOverlayComponent } from './mat-overlay.component';
import { MatOverlayManagerComponent } from '../manager/mat-overlay-manager.component';

export interface IMatOverlayComponentConstructor<GOverlayComponent extends MatOverlayComponent, GArguments extends any[]> {
  new(
    manager: MatOverlayManagerComponent,
    ...args: GArguments
  ): GOverlayComponent;
}
