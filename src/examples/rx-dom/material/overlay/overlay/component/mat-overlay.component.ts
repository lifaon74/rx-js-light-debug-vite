import { MatOverlayManagerComponent } from '../manager/mat-overlay-manager.component';

export type IOverlayCloseOrigin = 'backdrop';

/**
 * Abstract component to build your overlay from
 */
export abstract class MatOverlayComponent extends HTMLElement {
  public readonly manager: MatOverlayManagerComponent;

  protected constructor(
    manager: MatOverlayManagerComponent,
  ) {
    super();
    this.manager = manager;
  }

  close(origin?: IOverlayCloseOrigin): void {
    this.manager.close(this);
  }
}

